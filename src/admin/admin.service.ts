import { Injectable } from '@nestjs/common';
// import { CreateAdminInput } from './dto/create-admin.input';
// import { UpdateAdminInput } from './dto/update-admin.input';

@Injectable()
export class AdminService {
  create(createAdminInput: any) {
    console.log(createAdminInput);
    return 'This action adds a new admin';
  }

  findAll() {
    return `This action returns all admin`;
  }

  findOne(id: number) {
    return `This action returns a #${id} admin`;
  }

  update(id: number) {
    return `This action updates a #${id} admin`;
  }

  remove(id: number) {
    return `This action removes a #${id} admin`;
  }
  // create admin
  // admin login
  // admin change password
  // admin reset password
  // admin logout
  // admin forgot password
  // get all users
  // get all users by role
  // get all active users (user last login date is not null)
  // get all inactive users (user last login date is null)
  // get all user by demographic (Gender, location, age, etc)
  // verification of user
  // suspend/disable user account (user can't login)
}
