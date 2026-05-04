import {IsNumber, IsString} from "class-validator";

export class HealthCheckResponse {
    @IsString()
    status: string;
    @IsNumber()
    ts: number
}