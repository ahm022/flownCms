import { Injectable } from '@angular/core';
import { Apollo } from "apollo-angular";

import * as _ from "lodash";
import gql from "graphql-tag";
import { GeneralService } from './general.service';

@Injectable({
  providedIn: 'root'
})
export class GraphqlService {

  constructor(private apollo: Apollo, private generalService: GeneralService) { }

    getGraphQL(query: String, variables?: any): Promise<any> {
      let subscription = null;

      return new Promise((resolve, reject) => {

        let actualQuery = query;
        try {
          subscription = this.apollo
            .query<any>({
              query: gql`
                ${actualQuery}
              `,
              variables
            }).subscribe(({data})=>{
              resolve(data)
            })
        } catch (e) {
          this.generalService.printError("GraphQL Error", e);
          reject(e);
        }
      })
    }
    mutateGraphQL(query: String, variables?: any): Promise<any> {
      let subscription = null;

      return new Promise((resolve, reject) => {

        let actualQuery = query;
        try {
          subscription = this.apollo
            .mutate<any>({
              mutation: gql`
                ${actualQuery}
              `,
              variables
            }).subscribe(({data})=>{
              resolve(data)
            })
        } catch (e) {
          this.generalService.printError("GraphQL Error", e);
          reject(e);
        }
      })
    }

}
