import {Controller, Get, Logger} from '@nestjs/common';

@Controller()
export class AppController {
  private readonly logger = new Logger(AppController.name)
  @Get()
  getHello(): string {
    const port = process.env.PORT || 3000;
    this.logger.log("Lancé sur le port : " + port);
    return port.toString();
  }

}
