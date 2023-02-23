export interface Session {
    user: User | null,
    loading:boolean,
    isDark:boolean,
    isCalling:boolean
}

export interface User{
    id:number,
    username:String,
    first_name:String,
    last_name:String,
    description:string | null,
    publication:any[]
}
  