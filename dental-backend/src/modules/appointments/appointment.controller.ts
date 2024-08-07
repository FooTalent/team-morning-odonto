/* eslint-disable prettier/prettier */
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { Appointment } from '@prisma/client';
import { ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { AppointmentRequestDto } from '../../dtos';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { UpdateAppointmentStateDto } from 'src/dtos/update-appointment-state.dto';
import { UpdateAppointmentDto } from 'src/dtos/update-appointment.dto';

@ApiBearerAuth()
@ApiTags('Citas')
@Controller('api/appointments')
export class AppointmentController {
  constructor(private readonly service: AppointmentService) {}

  @Get()
  async getAllAppointments(): Promise<Appointment[]> {
    return await this.service.getAllAppointments();
  }

  @Get(':id')
  async getAppointment(@Param('id') id: string): Promise<Appointment> {
    return await this.service.getAppointment(parseInt(id));
  }

  @Post('/create-appointment')
  @ApiBody({ type: AppointmentRequestDto })
  async addAppointment(
    @Body() data: AppointmentRequestDto,
    @Res() res: Response,
  ) {
    try {
      const appointmentInfo = await this.service.addAppointment(data);
      return res.status(HttpStatus.OK).json({
        statusCode: 200,
        appointmentInfo,
      });
    } catch (error) {
      throw error;
    }
  }

  @Put('/update-appointment/:appointmentId')
  @ApiBody({ type: UpdateAppointmentDto })
  async updateAppointment(
    @Param('appointmentId') appointmentId: string,
    @Body() newData: UpdateAppointmentDto,
    @Res() res: Response,
  ) {
    try {
      const appointmentUpdated = await this.service.updateAppointment(
        parseInt(appointmentId),
        newData,
      );
      return res.status(HttpStatus.OK).json({
        statusCode: 200,
        message: `Turno actualizado correctamente`,
        appointmentUpdated,
      });
    } catch (error) {
      throw error;
    }
  }

  @Put('/update-appointment-state/')
  @ApiBody({ type: UpdateAppointmentStateDto })
  async updateAppointmentState(
    @Body() data: UpdateAppointmentStateDto,
    @Res() res: Response,
  ) {
    try {
      const appointmentUpdated =
        await this.service.changeAppointmentState(data);
      return res.status(HttpStatus.OK).json({
        statusCode: 200,
        message: `El estado del turno ha cambiado a ${data.state}`,
        appointmentUpdated,
      });
    } catch (error) {
      return res.json({
        error: error.message,
        message: 'An error ocurred',
        statusCode: error.status,
      });
    }
  }

  @Delete(':id')
  async deleteAppointment(@Param('id') id: string): Promise<Appointment> {
    return await this.service.deleteAppointment(parseInt(id));
  }
}
