import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { UserActiveService } from "./user-active.service";
import { Observable, map, catchError, of } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class AdminGuard implements CanActivate {

    constructor(private userActiveService: UserActiveService, private router: Router) { }

    canActivate(): Observable<boolean> {
        return this.userActiveService.getSelectedUser().pipe(
            map(user => {
                if (user && user.role === 'admin') {
                    return true;
                } else {
                    this.router.navigate(['']);
                    return false;
                }
            }),
            catchError(() => {
                this.router.navigate(['']);
                return of(false);
            })
        );
    }
}