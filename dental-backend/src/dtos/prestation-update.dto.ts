import { ApiProperty } from '@nestjs/swagger';
import { $Enums, Prestations } from '@prisma/client';
import { OdontogramDto } from './prestation-create.dto';

export class PrestationUpdateDto implements Partial<Prestations> {
  @ApiProperty()
  id: number;
  @ApiProperty()
  state?: $Enums.PrestationState;
  @ApiProperty()
  patientId?: number;
  @ApiProperty()
  date?: string;
  @ApiProperty()
  code?: string;
  @ApiProperty()
  observations?: string;
  @ApiProperty({ type: [OdontogramDto] })
  odontogram?: Partial<OdontogramDto>[];
}
