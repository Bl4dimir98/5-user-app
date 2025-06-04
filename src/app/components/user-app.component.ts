import { Component, OnInit } from '@angular/core';
import { User } from '../models/user';
import { UserService } from '../services/user.service';
import Swal from 'sweetalert2';
import { Router, RouterOutlet } from '@angular/router';
import { NavbarComponent } from "./navbar/navbar.component";
import { SharingDataService } from '../services/sharing-data.service';

@Component({
  selector: 'user-app',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent],
  templateUrl: './user-app.component.html',
  styleUrls: ['./user-app.component.css']
})
export class UserAppComponent implements OnInit {

  title: string = 'Listado de usuarios!';

  users: User[] = [];

  constructor(
    private router: Router,
    private sharingDataService: SharingDataService,
    private service: UserService) {
  }

  ngOnInit(): void {
    this.service.findAll().subscribe(users => this.users = users);
    this.addUser();
    this.removeUser();
    this.findUserById();
  }

  findUserById(): void {
    this.sharingDataService.findUserByIdEventeEmmiter.subscribe(id => {
      const user = this.users.find(user => user.id == id);
      this.sharingDataService.selectUserEventeEmmiter.emit(user);
    })
  }

  addUser() {
    this.sharingDataService.newUserEventEmitter.subscribe(user => {
      if (user.id > 0) {
        this.service.update(user).subscribe(
          {
            next: (userUpdate) => {
              this.users = this.users.map(u => (u.id == userUpdate.id) ? { ...userUpdate } : u);
              this.router.navigate(['/users'], { state: { users: this.users } });
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
              this.users = [... this.users, { ...userNew }];

              this.router.navigate(['/users'], { state: { users: this.users } });
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
            this.users = this.users.filter(user => user.id != id);
            this.router.navigate(['/users/create'], { skipLocationChange: true }).then(() => {
              this.router.navigate(['/users'], { state: { users: this.users } });
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
