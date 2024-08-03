import { HttpInterceptor, HttpRequest, HttpHandler } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AuthService } from "../services/auth.service";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor(private authService: AuthService) { }

    // Receiving the Request (req) and the Request Handler (next)
    intercept(req: HttpRequest<any>, next: HttpHandler) {

        // Headers
        const headers = this.authService.getHeaders();

        // Clones the Request with the Headers
        const authReq = req.clone({ headers });

        // Pass modified Request to next handler / Backend
        return next.handle(authReq);
    }
}