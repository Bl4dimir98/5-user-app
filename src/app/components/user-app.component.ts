import { Component, OnInit } from '@angular/core';
import { User } from '../models/user';
import { UserService } from '../services/user.service';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { NavbarComponent } from "./navbar/navbar.component";
import { SharingDataService } from '../services/sharing-data.service';
import { AuthService } from '../services/auth.service';
import { Store } from '@ngrx/store';
import { add, find, findAll, remove, setPaginator, update } from '../store/users.acctions';

@Component({
  selector: 'user-app',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent],
  templateUrl: './user-app.component.html',
  styleUrls: ['./user-app.component.css']
})
export class UserAppComponent implements OnInit {

  users: User[] = [];
  paginator: any = {};
  user!: User;

  constructor(
    private store: Store<{ users: any }>,
    private router: Router,
    private sharingDataService: SharingDataService,
    private authService: AuthService,
    private service: UserService,
    private route: ActivatedRoute) {
    this.store.select('users').subscribe(state => {
      this.users = state.users;
      this.paginator = state.paginator;
      this.user = state.user;
    })
  }

  ngOnInit(): void {
    this.addUser();
    this.removeUser();
    this.findUserById();
    this.pageUsersEvent();
    this.handlerLogin();
  }

  handlerLogin() {
    this.sharingDataService.handlerLoginEventEmmiter.subscribe(({ username, password }) => {
      console.log(username + ' ' + password);

      this.authService.loginUser({ username, password }).subscribe({
        next: response => {
          const token = response.token;
          console.log(token);
          const payload = this.authService.getPayload(token);

          const user = { username: payload.sub };
          const login = {
            user,
            isAuth: true,
            isAdmin: payload.isAdmin
          }
          this.authService.token = token;
          this.authService.user = login;
          this.router.navigate(['/users/page/0']);
        },
        error: error => {
          if (error.status == 401) {
            Swal.fire(
              'Error en el login',
              error.error.message,
              'error'
            );
          } else {
            throw error;
          }
        }
      })

    });
  }

  pageUsersEvent() {
    this.sharingDataService.pageUsersEventEmmiter.subscribe(pageable => {
      // this.users = pageable.users;
      // this.paginator = pageable.paginator;
      this.store.dispatch(findAll({ users: pageable.users }));
      this.store.dispatch(setPaginator({ paginator: pageable.paginator }));
    });
  }

  findUserById(): void {
    this.sharingDataService.findUserByIdEventeEmmiter.subscribe(id => {

      // const user = this.users.find(user => user.id == id);
      this.store.dispatch(find({ id }))
      this.sharingDataService.selectUserEventeEmmiter.emit(this.user);
    })
  }

  addUser() {
    this.sharingDataService.newUserEventEmitter.subscribe(user => {
      if (user.id > 0) {
        this.service.update(user).subscribe(
          {
            next: (userUpdated) => {
              // this.users = this.users.map(u => (u.id == userUpdate.id) ? { ...userUpdate } : u);
              this.store.dispatch(update({ userUpdated }));
              this.router.navigate(['/users'], {
                state: {
                  users: this.users,
                  paginator: this.paginator
                }
              });
              Swal.fire({
                title: "Actualizado!",
                text: "Usuario editado con exito!",
                icon: "success"
              });
            },
            error: (err) => {
              // console.log(err.error);
              if (err.status == 400) {
                this.sharingDataService.errorsUserFormEventEmmiter.emit(err.error);
              }
            }
          });
      } else {
        this.service.create(user).subscribe(
          {
            next: (userNew) => {
              console.log(userNew);
              // this.users = [... this.users, { ...userNew }];
              this.store.dispatch(add({ userNew }));
              this.router.navigate(['/users'], {
                state: {
                  users: this.users,
                  paginator: this.paginator
                }
              });
              Swal.fire({
                title: "Guardado!",
                text: "Usuario creado con exito!",
                icon: "success"
              });
            },
            error: (err) => {
              // console.log(err.error);
              console.log(err.status);
              if (err.status == 400) {
                this.sharingDataService.errorsUserFormEventEmmiter.emit(err.error);
              }
            }
          }
        );
      }

    })
  }

  removeUser(): void {
    this.sharingDataService.idUserEventEmitter.subscribe(id => {
      Swal.fire({
        title: "Seguro que quiere eliminar?",
        text: "Cuidado el usuario sera eliminado del sistema!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Si"
      }).then((result) => {
        if (result.isConfirmed) {
          this.service.remove(id).subscribe(() => {
            // this.users = this.users.filter(user => user.id != id);
            this.store.dispatch(remove({ id }));
            this.router.navigate(['/users/create'], { skipLocationChange: true }).then(() => {
              this.router.navigate(['/users'], {
                state: {
                  users: this.users,
                  paginator: this.paginator
                }
              });
            });
          });
          Swal.fire({
            title: "Eliminado!",
            text: "Usuario eliminado con exito.",
            icon: "success"
          });
        }
      });
    });
  }

}
