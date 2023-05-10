export default class UserDTO {
    constructor(user) {
        this.name = user.first_name,
        this.lastname = user.last_name,
        this.fullname = user.first_name + ' ' + user.last_name,
        this.email = user.email,
        this.role = user.role
    }
};