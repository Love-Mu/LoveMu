import { HttpClient, HttpEvent, HttpErrorResponse, HttpEventType } from  '@angular/common/http';  
import { map } from  'rxjs/operators';
import { Injectable } from '@angular/core';

@Injectable({  
  providedIn: 'root'  
})  
export class UploadService { 
	SERVER_URL: string = "https://lovemu.compsoc.ie/upload/upload";  
  constructor(private httpClient: HttpClient) { }
  public upload(formData) {

    return this.httpClient.post<any>(this.SERVER_URL, formData, {  
        reportProgress: true,  
        observe: 'events'  
      });  
  }
}