const environments = (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') ? 
{baseUrl:"127.0.0.1:8000",protocol:"http://"} :
{baseUrl:"www.whatsapp-lionel-arel.ga",protocol:"https://"}

export default environments;