import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { UserService } from "../../services/user.service";
import { add, addSuccess, findAllPageable, load, remove, removeSuccess, setErrors, update, updateSuccess } from "./users.acctions";
import { catchError, exhaustMap, map, of, tap } from "rxjs";
import { User } from "../../models/user";
import Swal from "sweetalert2";
import { Router } from "@angular/router";

@Injectable()
export class UserEffects {

    loadUsers$ = createEffect(
        () => this.actions$.pipe(
            ofType(load),
            exhaustMap(action => this.userService.findAllPageable(action.page)
                .pipe(
                    map(pageable => {
                        const users = pageable.content as User[];
                        const paginator = pageable;

                        return findAllPageable({ users, paginator });
                    }),
                    catchError((error) => of(error))
                ))
        )
    );

    addUser$ = createEffect(
        () => this.actions$.pipe(
            ofType(add),
            exhaustMap(action => this.userService.create(action.userNew)
                .pipe(
                    map(userNew => addSuccess({ userNew })),
                    catchError(error => (error.status == 400) ? of(setErrors({ userForm: action.userNew, errors: error.error })) : of(error)
                    )
                )
            )
        )
    );

    updateUser$ = createEffect(
        () => this.actions$.pipe(
            ofType(update),
            exhaustMap(action => this.userService.update(action.userUpdated)
                .pipe(
                    map(userUpdated => updateSuccess({ userUpdated })),
                    catchError(error => (error.status == 400) ? of(setErrors({ userForm: action.userUpdated, errors: error.error })) : of(error)
                    )
                )
            )
        )
    );

    removeUser$ = createEffect(
        () => this.actions$.pipe(
            ofType(remove),
            exhaustMap(action => this.userService.remove(action.id)
                .pipe(
                    map(() => removeSuccess({ id: action.id }))
                )
            )
        )
    );

    addSuccessUser$ = createEffect(
        () => this.actions$.pipe(
            ofType(addSuccess),
            tap(() => {
                this.router.navigate(['/users']);
                Swal.fire({
                    title: "Creado nuevo usuario!",
                    text: "Usuario creado con exito!",
                    icon: "success"
                });
            })
        ), { dispatch: false }
    )

    updateSuccessUser$ = createEffect(
        () => this.actions$.pipe(
            ofType(updateSuccess),
            tap(() => {
                this.router.navigate(['/users']);
                Swal.fire({
                    title: "Actualizado!",
                    text: "Usuario editado con exito!",
                    icon: "success"
                });
            })
        ), { dispatch: false }
    )

    removeSuccessUser$ = createEffect(
        () => this.actions$.pipe(
            ofType(removeSuccess),
            tap(() => {
                this.router.navigate(['/users']);
                Swal.fire({
                    title: "Eliminado!",
                    text: "Usuario eliminado con exito.",
                    icon: "success"
                });
            })
        ), { dispatch: false }
    )

    constructor(
        private router: Router,
        private actions$: Actions,
        private userService: UserService
    ) {

    }

}