import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IpService {

  constructor(private http: HttpClient) { }

  public getIPv4Address(): Observable<ArrayBuffer> {
    return this.http.get("https://api4.ipify.org/?format=json").pipe(
      map((res: any) => this.ipv4StringToVarBinary(res.ip))
    );
  }

  public getIPv6Address(): Observable<ArrayBuffer> {
    return this.http.get("https://api6.ipify.org/?format=json").pipe(
      map((res: any) => this.ipv6StringToVarBinary(res.ip))
    );
  }

  public getMacAddress() {

  }

  // Convert ArrayBuffer to string assuming UTF-8 encoding
  public arrayBufferToString(buffer: ArrayBuffer): string {
    const decoder = new TextDecoder('utf-8');
    return decoder.decode(new Uint8Array(buffer));
  }

  // Function to convert IPv4 string to ArrayBuffer
  private ipv4StringToVarBinary(ipv4String: string): ArrayBuffer {
    const hexString = ipv4String.split('.').map(part => (+part).toString(16).padStart(2, '0')).join('');
    return this.hexStringToArrayBuffer(hexString);
  }

  // Function to convert hexadecimal string to ArrayBuffer
  private hexStringToArrayBuffer(hexString: string): ArrayBuffer {
    const buffer = new ArrayBuffer(hexString.length / 2);
    const view = new Uint8Array(buffer);
    for (let i = 0; i < hexString.length; i += 2) {
      view[i / 2] = parseInt(hexString.substring(i, i + 2), 16);
    }
    return buffer;
  }

  private ipv6StringToVarBinary(ipv6String: string): ArrayBuffer {
    // Remove colons and convert the IPv6 string to binary
    const binaryString = ipv6String.split(':').map(part => parseInt(part, 16).toString(2).padStart(16, '0')).join('');

    // Convert binary string to ArrayBuffer
    return this.binaryStringToArrayBuffer(binaryString);
  }

  private binaryStringToArrayBuffer(binaryString: string): ArrayBuffer {
    const length = binaryString.length;
    const buffer = new ArrayBuffer(length / 8);
    const view = new Uint8Array(buffer);

    for (let i = 0; i < length; i += 8) {
      view[i / 8] = parseInt(binaryString.substring(i, i + 8), 2);
    }

    return buffer;
  }
}
