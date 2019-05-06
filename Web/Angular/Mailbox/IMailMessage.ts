namespace MailBox {
	export interface IMailMessage {
		//recieved from server
		id: number;
        when?: string;          
        lead?: string;                   
        fromId?:number;                    
        toId?:number;                      
        status?:number;       
        partnerDisplayName?:string;
        subject?:string;                
        replyToMail?: number;

		//generated on client
		firstName? : string;
		lastName?  : string;
		date?      : Date;
		content?   : string;

	}

	 
}