import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Delete,
} from '@nestjs/common';
import { TicketTransfersService } from './ticket-transfers.service';
import { CreateTransferDto } from './dto/create-transfer.dto';
import { RespondTransferDto } from './dto/respond-transfer.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Public } from '../auth/decorators/public.decorator';

@Controller('ticket-transfers')
export class TicketTransfersController {
  constructor(private readonly ticketTransfersService: TicketTransfersService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  createTransfer(
    @CurrentUser() user: any,
    @Body() createTransferDto: CreateTransferDto,
  ) {
    return this.ticketTransfersService.createTransfer(user.id, createTransferDto);
  }

  @Public()
  @Get('token/:transferToken')
  getTransferByToken(@Param('transferToken') transferToken: string) {
    return this.ticketTransfersService.getTransferByToken(transferToken);
  }

  @UseGuards(JwtAuthGuard)
  @Post('token/:transferToken/respond')
  respondToTransfer(
    @Param('transferToken') transferToken: string,
    @CurrentUser() user: any,
    @Body() respondTransferDto: RespondTransferDto,
  ) {
    return this.ticketTransfersService.respondToTransfer(
      transferToken,
      user.id,
      respondTransferDto.response,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('my-transfers')
  getUserTransfers(@CurrentUser() user: any) {
    return this.ticketTransfersService.getUserTransfers(user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':transferId')
  cancelTransfer(
    @Param('transferId') transferId: string,
    @CurrentUser() user: any,
  ) {
    return this.ticketTransfersService.cancelTransfer(transferId, user.id);
  }
}
