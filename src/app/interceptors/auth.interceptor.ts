import { HttpInterceptor, HttpRequest, HttpHandler } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AuthorizationService } from "../services/authorization-service";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor(private authorizationService: AuthorizationService) { }

    // Receiving the Request (req) and the Request Handler (next)
    intercept(req: HttpRequest<any>, next: HttpHandler) {

        // Headers
        const headers = this.authorizationService.getHeaders();

        // Clones the Request with the Headers
        const authReq = req.clone({ headers });

        // Pass modified Request to next handler / Backend
        return next.handle(authReq);
    }
}