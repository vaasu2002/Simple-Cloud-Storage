export type DTORegsiterUserData = {
    username:string,
    email:string,
    password:string
}

export type DTOreturnRegsiterUserData = {
    user:{
        _id:string,
        username:string,
        email:string
    },
    token:string
}
export type DTOreturnLoginUserData = DTOreturnRegsiterUserData;