import { HttpClient, HttpEvent, HttpErrorResponse, HttpEventType, HttpParams } from  '@angular/common/http';  
import { map } from  'rxjs/operators';
import { Injectable } from '@angular/core';

@Injectable({  
  providedIn: 'root'  
})  
export class UploadService { 
  uploadURL: string = "https://lovemu.compsoc.ie/upload/upload"; 
  updateURL: string = "https://lovemu.compsoc.ie/upload/reupload"; 
  constructor(private httpClient: HttpClient) { }

  public upload(formData) {
    return this.httpClient.post<any>(this.uploadURL, formData, {
      reportProgress: true,  
      observe: 'events'  
    });
  }

  public update(formData) {
    return this.httpClient.post<any>(this.updateURL, formData, {
      reportProgress: true,  
      observe: 'events'  
    });
  }

}                                                                                       