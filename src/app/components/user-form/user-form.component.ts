import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { User } from '../../models/user';
import { SharingDataService } from '../../services/sharing-data.service';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'user-form',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './user-form.component.html'
})
export class UserFormComponent implements OnInit {

  user: User;
  errors: any = {};

  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private sharingDataService: SharingDataService) {
    this.user = new User();
  }

  ngOnInit(): void {
    this.sharingDataService.errorsUserFormEventEmmiter.subscribe(errors => this.errors = errors);
    this.sharingDataService.selectUserEventeEmmiter.subscribe(user => this.user = user);

    this.route.paramMap.subscribe(params => {
      const id: number = +(params.get('id') || '0');

      if (id > 0) {
        this.sharingDataService.findUserByIdEventeEmmiter.emit(id);
        // this.userService.findById(id).subscribe(user => this.user = user);
      }
    });
  }

  onSubmit(userForm: NgForm): void {
    // if (userForm.valid) {
    this.sharingDataService.newUserEventEmitter.emit(this.user);
    console.log(this.user);
    // }
    // userForm.reset();
    // userForm.resetForm();
  }

  onClear(userForm: NgForm): void {
    this.user = new User();
    userForm.reset();
    userForm.resetForm();
  }

}
