import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IpService {

  private ipv4_url: string = "https://api4.ipify.org/?format=json"
  private ipv6_url: string = "https://api6.ipify.org/?format=json"

  constructor(private http: HttpClient) { }

  public getIPv4Address(): Observable<string | null> {
    return this.http.get(this.ipv4_url).pipe(
      map((res: any) => {
        return res.ip;
      })
    );
  }

  public getIPv6Address(): Observable<string | null> {
    return this.http.get(this.ipv6_url).pipe(
      map((res: any) => {
        return res.ip;
      })
    );
  }
}
