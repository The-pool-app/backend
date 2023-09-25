import request from "supertest"
import { app } from "../../src"
import { AppDataSource } from "../../src/utils/data-source"
import { User } from "../../src/entity/User"


beforeAll(() => {
    return AppDataSource.initialize()
})


beforeEach(() => {
    return AppDataSource.getRepository(User).clear()
})

describe(' Application Status', () => { 
    it("Health check" , async()=>{
        const res = await request(app).get("/api/v1/status")
        expect(res.body.message).toBe("All System OK")
        expect(res.status).toBe(200)
    })
 })

describe("User registration", () => {
    const user = {
        firstName: "litmus",
        email: "user@test.com",
        lastName: "zhang",
        phoneNumber: "09012345678",
        password: "12345678",
        confirmPassword: "12345678",
    }
    const validUser = async (payload = user) => {
        return request(app).post("/api/v1/users/register").send(payload);
    };
    it("create a new user in the database", async () => {
        await validUser()
        const userCount = await AppDataSource.getRepository(User).count()
        expect(userCount).toBe(1)
    })
    it("should return 200 Ok when user signup request is valid", async () => {
        const res = await validUser()
        expect(res.status).toBe(200)
    })
    it("should return password mismatch error when password and confirm password do not match", async () => {
        const res = await validUser({ ...user, confirmPassword: "password1" })
        expect(res.status).toBe(400)
        expect(res.body.message).toBe("Password mismatch")
    })
    it('Should return a successful message when user signup request is valid', async () => {
        const res = await validUser()
        expect(res.body.message).toBe("User created successfully")
    })
    it("should return email already exists error when email already exists", async () => {
        await validUser()
        const res = await validUser()
        expect(res.body.message).toBe("User already exist")
        expect(res.status).toBe(400)
        })
    it("should ensure password is hashed", async ()=>{
        const res = await validUser()
        const userController = AppDataSource.getRepository(User)
        const user = await userController.findOneBy({email: "user@test.com"})
        expect(user.password).not.toBe("12345678")

    })
})