const environments = (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') ? 
{
    baseUrl:"127.0.0.1:8000",
    protocol:"http://",
    S3_BUCKET:'whatsapp-clone-bucket-files',
    REGION:'eu-west-3',
    ACCESS_KEY:'AKIA2LKTDJEARTZNKV56',
    SECRET_ACCESS_KEY:'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',
    appId:"d2160e16d6634613aba0588ea88fc4d8",
    
} :
{
    baseUrl:"www.whatsapp.lionel-arel.com/backend",
    protocol:"https://",
    S3_BUCKET:'whatsapp-clone-bucket-files',
    REGION:'eu-west-3',
    ACCESS_KEY:'AKIA2LKTDJEARTZNKV56',
    SECRET_ACCESS_KEY:'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',
    appId:"d2160e16d6634613aba0588ea88fc4d8",
}

export default environments;