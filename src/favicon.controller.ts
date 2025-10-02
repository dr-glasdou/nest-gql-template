import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';

@Controller()
export class FaviconController {
  @Get('favicon.ico')
  @HttpCode(HttpStatus.NOT_FOUND)
  getFavicon() {
    // Return 404 Not Found for favicon.ico
    return { message: 'Favicon not found', statusCode: HttpStatus.NOT_FOUND };
  }
}
