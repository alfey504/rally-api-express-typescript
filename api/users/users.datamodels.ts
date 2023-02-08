
declare module "user_types" {

    export type Verified = {
        verified: Boolean;
        message: String;
    }  
    
    export type UserData = {
        fullName: String | undefined;
        email: String | undefined;
        userName : String | undefined;
        password : String | undefined;
        verified : boolean | undefined;
    }
}