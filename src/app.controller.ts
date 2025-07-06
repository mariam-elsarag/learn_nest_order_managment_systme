import { Controller, Get } from "@nestjs/common";

@Controller()
export class APPController {
  @Get("/")
  getHome() {
    return "Your app is working";
  }
}
