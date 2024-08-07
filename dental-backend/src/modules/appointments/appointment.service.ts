import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AppointmentRepository } from './appointment.repository';
import { $Enums, Appointment } from '@prisma/client';
import { AppointmentRequestDto } from 'src/dtos';
import { PatientService } from '../patients/patients.service';
import { DentistService } from '../dentists/dentist.service';
import { EmailService } from 'src/utils/email.service';
import { UpdateAppointmentStateDto } from 'src/dtos/update-appointment-state.dto';
import { UpdateAppointmentDto } from 'src/dtos/update-appointment.dto';

@Injectable()
export class AppointmentService {
  constructor(
    private readonly repository: AppointmentRepository,
    private patientService: PatientService,
    private dentistService: DentistService,
    private mailService: EmailService,
  ) { }

  async getAppointment(id: number): Promise<Appointment> {
    const appointment = await this.repository.GetAppointmentById(id);

    if (!appointment) throw new NotFoundException('Cita no encontrada');

    return appointment;
  }

  async getAllAppointments(): Promise<Appointment[]> {
    const appointments = await this.repository.GetAllAppointments();
    return appointments;
  }


  async addAppointment(data: AppointmentRequestDto): Promise<Appointment> {
    const { reason, dentistId, patientId, date, odontograma = '' } = data;
    const now = new Date();
    const appointmentDate = new Date(date);

    const state = $Enums.AppointmentState.PENDING;
    const dentist = await this.dentistService.findDentist(dentistId);
    const patient = await this.patientService.getPatient(patientId);

    if (!patient || !dentist) {
      throw new NotFoundException('No se pudo encontrar al paciente o al dentista');
    }

    if (appointmentDate <= now) {
      throw new HttpException('No se pueden asignar turnos en fechas y horarios pasados', HttpStatus.CONFLICT);
    }

    const verifyDentist = await this.repository.checkDentistAvailability(dentistId, appointmentDate)
    if(verifyDentist > 2) {
      throw new HttpException(`El Dr. ${dentist.fullname} ya tiene mas de 3 turnos asignados para el dia ${appointmentDate.toLocaleDateString()}`, HttpStatus.CONFLICT);
    }

    // Verificar si ya existe una cita para la misma fecha y dentista
    const verifyDate = await this.repository.checkAvailability(appointmentDate);
    if (!verifyDate) {
      throw new ConflictException('Ya hay un turno asignado para esta fecha y horario');
    }

    // Verificar si ya existe una cita en un rango de 15 minutos
    const verifyTimeRange = await this.repository.checkTimeRangeAvailability(appointmentDate);
    if (!verifyTimeRange) {
      throw new HttpException('Ya hay un turno creado en un rango de 15 minutos al que deseas ingresar', HttpStatus.CONFLICT);
    }

    // Crear nueva cita
    const newAppointment = {
      state: state,
      results: '',
      reason,
      date: appointmentDate,
      dentistId,
      patientId: patientId,
      odontograma,
    };

    // Enviar correo de confirmación
    await this.mailService.sendConfirmEmail(patient, newAppointment, dentist);

    return await this.repository.AddAppointment(newAppointment);
  }

  async changeAppointmentState(newState: UpdateAppointmentStateDto) {
    const { state, appointmentId } = newState
    const updateState = await this.repository.updateAppointmentState(appointmentId, state)

    if (state === 'CANCEL') {
      const patient = await this.patientService.getPatient(updateState.patientId)
      await this.mailService.sendCancelEmail(patient, updateState)
    }
    return updateState
  }

  async updateAppointment(id: number, newAppointment: UpdateAppointmentDto): Promise<Appointment> {
    try {
      const now = new Date();
      const newAppointmentDate = new Date(newAppointment.date)
      const existingAppointment = await this.getAppointment(id);
      if (!existingAppointment) {
        throw new NotFoundException('Cita no encontrada');
      }

      const patient = await this.patientService.getPatient(existingAppointment.patientId);
      const lastDentist = await this.dentistService.findDentist(existingAppointment.dentistId);
      const newDentist = await this.dentistService.findDentist(newAppointment.dentistId);

      if (newAppointmentDate <= now) {
        throw new HttpException('No se pueden asignar turnos en fechas y horarios pasados', HttpStatus.CONFLICT);
      }
  
      const verifyDentist = await this.repository.checkDentistAvailability(newAppointment.dentistId, newAppointmentDate)
      if(verifyDentist > 2) {
        throw new HttpException(`El dentista seleccionado ya tiene mas de 3 turnos asignados para el dia ${newAppointmentDate.toLocaleDateString()}`, HttpStatus.CONFLICT);
      }
  
      // Verificar si ya existe una cita para la misma fecha y dentista
      const verifyDate = await this.repository.checkAvailability(newAppointmentDate);
      if (!verifyDate) {
        throw new ConflictException('Ya hay un turno asignado para esta fecha y horario');
      }
  
      // Verificar si ya existe una cita en un rango de 15 minutos
      const verifyTimeRange = await this.repository.checkTimeRangeAvailability(newAppointmentDate);
      if (!verifyTimeRange) {
        throw new HttpException('Ya hay un turno creado en un rango de 15 minutos al que deseas ingresar', HttpStatus.CONFLICT);
      }

      const newAppointmentUpdate = await this.repository.updateAppointment(id, newAppointment);
      await this.mailService.sendUpdateEmail(existingAppointment, newAppointmentUpdate, patient, lastDentist, newDentist);
      return newAppointmentUpdate;
    } catch (error) {
      throw error;
    }
  }

  async deleteAppointment(id: number): Promise<Appointment> {
    const appointment = await this.repository.deleteAppointmentById(id);
    if (!appointment) {
      throw new NotFoundException('Appointment not found');
    }

    return appointment;
  }
}
