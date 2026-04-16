import {Controller, Get, Logger} from '@nestjs/common';

@Controller()
export class AppController {
  private readonly logger = new Logger(AppController.name)

  @Get()
  getHello(): string {
  this.logger.log('This is an info message');
  this.logger.warn('This is a warning');
  this.logger.error('This is an error');
    return "Hello World!"
  }
}
