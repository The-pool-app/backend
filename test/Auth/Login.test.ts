import request from "supertest"
import { app } from "../../src"
import { AppDataSource } from "../../src/utils/data-source"


beforeAll(() => {
    return AppDataSource.initialize()
})


describe("User login", ()=>{
    const user = {
        email: "user@test.com",
        password: "12345678"
    }
    const validLogin = (payload= user) =>{
        return request(app).post("/api/v1/users/login").send(payload)
    }
    it("shows error message when required field are not provided ", async ()=> {
        const res = await validLogin({...user, password: ""})
        expect(res.body.message).toBe("missing required values")
        
    })
    it("shows error message when invalid credentials are provided ", async ()=> {
        const res = await validLogin({...user, password: "password"})
        expect(res.body.message).toBe("invalid credentials")
        
    })
    it("shows success message when valid credentials are provided ", async ()=> {
        const res = await validLogin()
        expect(res.body.message).toBe("User logged in successfully")
    })
})