export class UserDTO {
    constructor(user) {
        this.id = user._id;
        this.name = user.name;
        this.email = user.email;
        this.role = user.role;
        // Aquí puedes agregar otros campos necesarios para el frontend
    }
}