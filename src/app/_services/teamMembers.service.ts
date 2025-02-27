import { inject, model, signal } from "@angular/core";
import { environment } from "../../environments/environment.development";
import { setPaginatedResponse, setPaginationHeaders } from "./paginationHelper";
import { AccountService } from "./account.service";
import { HttpClient } from "@angular/common/http";
import { TeamMember } from "../_models/teamMember.model";
import { UserParams } from "../_models/userParams";
import { PaginatedResult } from "../_models/pagination";
import { of } from "rxjs";

export class MembersService {
  private http = inject(HttpClient);
  private accountService = inject(AccountService);
  baseUrl = environment.apiUrl;
  paginatedResult = signal<PaginatedResult<TeamMember[]> | null>(null);
  memberCache = new Map();
  user = this.accountService.currentUser();
  userParams = model<UserParams>(new UserParams(this.user));

  resetUserParams() {
    this.userParams.set(new UserParams(this.user));
  }

  getTeamMembers() {
    const response = this.memberCache.get(Object.values(this.userParams()).join('-'));

    if (response) return setPaginatedResponse(response, this.paginatedResult);

    let params = setPaginationHeaders(this.userParams().pageNumber, this.userParams().pageSize);

    params = params.append('orderBy', this.userParams().orderBy);

    return this.http.get<TeamMember[]>(this.baseUrl + 'users', {observe: 'response', params}).subscribe({
      next: response => {
        setPaginatedResponse(response, this.paginatedResult);
        this.memberCache.set(Object.values(this.userParams()).join('-'), response);
      }
    })
  }

  getTeamMember(username: string) {
    const member: TeamMember = [...this.memberCache.values()]
      .reduce((arr, elem) => arr.concat(elem.body), [])
      .find((m: TeamMember) => m.username === username);

    if (member) return of(member);

    return this.http.get<TeamMember>(this.baseUrl + 'users/' + username);
  }
}
