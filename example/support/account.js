const store = new Map();
const logins = new Map();
const { nanoid } = require('nanoid');

class Account {
  constructor(id, profile) {
    this.accountId = id || nanoid();
    this.profile = profile;
    store.set(this.accountId, this);
  }

  /**
   * @param use - can either be "id_token" or "userinfo", depending on
   *   where the specific claims are intended to be put in.
   * @param scope - the intended scope, while oidc-provider will mask
   *   claims depending on the scope automatically you might want to skip
   *   loading some claims from external resources etc. based on this detail
   *   or not return them in id tokens but only userinfo and so on.
   */
  async claims(use, scope) { // eslint-disable-line no-unused-vars
    if (this.profile) {
      return {
        sub: this.accountId, // it is essential to always return a sub claim
        email: this.profile.email,
        email_verified: this.profile.email_verified,
        family_name: this.profile.family_name,
        given_name: this.profile.given_name,
        locale: this.profile.locale,
        name: this.profile.name,
      };
    }

    return {
      sub: this.accountId, // it is essential to always return a sub claim

      address: {
        country: '000',
        formatted: '000',
        locality: '000',
        postal_code: '000',
        region: '000',
        street_address: '000',
      },
      birthdate: '1987-10-16',
      email: 'johndoe@example.com',
      email_verified: false,
      family_name: 'Doe',
      gender: 'male',
      given_name: 'John',
      locale: 'en-US',
      middle_name: 'Middle',
      name: 'John Doe',
      nickname: 'Johny',
      phone_number: '+49 000 000000',
      phone_number_verified: false,
      picture: 'http://lorempixel.com/400/200/',
      preferred_username: 'johnny',
      profile: 'https://johnswebsite.com',
      updated_at: 1454704946,
      website: 'http://example.com',
      zoneinfo: 'Europe/Berlin',
      verified_claims: {
        "verification": {
          "trust_framework": "de_aml",
          "time": "2012-04-23T18:25Z",
          "verification_process": "f24c6f-6d3f-4ec5-973e-b0d8506f3bc7",
          "evidence": [
            {
              "type": "id_document",
              "method": "pipp",
              "time": "2012-04-22T11:30Z",
              "document": {
                "type": "idcard",
                "issuer": {
                  "name": "Stadt Augsburg",
                  "country": "DE"
                },
                "number": "53554554",
                "date_of_issuance": "2010-03-23",
                "date_of_expiry": "2020-03-22"
              }
            }
          ]
        },
        "claims": {
          "given_name": "Max",
          "family_name": "Meier",
          "birthdate": "1956-01-28",
          "place_of_birth": {
            "country": "DE",
            "locality": "Musterstadt"
          },
          "nationalities": [
            "DE"
          ],
          "address": {
            "locality": "Maxstadt",
            "postal_code": "12344",
            "country": "DE",
            "street_address": "An der Sandd&#252;ne 22"
          }
        }
      }
    };
  }

  static async findByFederated(provider, claims) {
    const id = `${provider}.${claims.sub}`;
    if (!logins.get(id)) {
      logins.set(id, new Account(id, claims));
    }
    return logins.get(id);
  }

  static async findByLogin(login) {
    if (!logins.get(login)) {
      logins.set(login, new Account(login));
    }

    return logins.get(login);
  }

  static async findAccount(ctx, id, token) { // eslint-disable-line no-unused-vars
    // token is a reference to the token used for which a given account is being loaded,
    //   it is undefined in scenarios where account claims are returned from authorization endpoint
    // ctx is the koa request context
    if (!store.get(id)) new Account(id); // eslint-disable-line no-new
    return store.get(id);
  }
}

module.exports = Account;
