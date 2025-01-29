import { Guid } from 'guid-typescript';

export class SecureGuid {
  static create(): string {
    return crypto.randomUUID();
  }

  static isValid(guid: string): boolean {
    return Guid.isGuid(guid);
  }

  static getEmptyGuid(): string {
    return Guid.EMPTY;
  }
}

export default defineNuxtPlugin(nuxtApp => {
  nuxtApp.provide('guid', SecureGuid);
});
