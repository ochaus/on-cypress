describe("Checkout process for a guest user with card payment", () => {

  it("opens on-running website", () => {
    cy.visit("https://staging-beta.on-running.com/", {
      auth: {
        username: "on",
        password: "trend",
      },
    });
  });

  it("should complete checkout process with card payment successfully", () => {
  // add item to cart  
    cy.get('[id="onetrust-accept-btn-handler"]').click();
    cy.contains("Running Shoes").click({ force: true });
    cy.get('[class="card-visual-box__image card-visual-box__image--contain"]')
      .first()
      .trigger("mouseover", { force: true });
    cy.get('[class="quick-add-button__text"]').should("be.visible");
    cy.get('[class="quick-add-button__text"]')
      .first()
      .click({ force: true });
    cy.get('[class="sizes__size"]').first().click();

  // proceed to checkout
    cy.contains("Checkout").click({ force: true });
    cy.get('[class="registration__title-guest"]', {
      timeout: 10000,
    }).should("contain.text", "Enter your Email address");
    cy.get('[id="email"]').type("test@test.com");
    cy.contains("Continue to Shipping").click();

  // checkout as a guest
    cy.contains("Check out as a guest").click({ force: true });
    cy.get('[id="firstname"]').type("John");
    cy.get('[id="lastname"]').type("Smith");
    cy.get('[id="address1"]').type("Teststr, 1");
    cy.get('[id="zipcode"]').type("10119");
    cy.get('[id="city"]').type("Berlin");
    cy.get('[id="phone"]').type("+49111111111111");
    cy.contains("Show Shipping Options").click();
    cy.contains("Continue to Payment").click();

  // select payment methog - card (it's not finished, I got stuck with iframe interaction)
    cy.get('[class="adyen-checkout__payment-method__name"]', {
      timeout: 10000,
    }).should("contain.text", "Pay with Card");
    cy.contains("Pay with Card").click();
    cy.get('span[data-cse="encryptedCardNumber"]').should("be.visible");
    cy.get(
      'div[class="adyen-checkout__card-input _2tAzuCpLXISBbB0i1w8DVZ"]'
    ).within(() => {
      cy.get('span[data-cse="encryptedCardNumber"]').within(() => {
        cy.get("iframe").then(($iframe) => {
          const $body = $iframe.contents().find("body");
          cy.wrap($body)
            .find("#encryptedCardNumber")
            .type("4646 4646 4646 4644");
        });
      });
    });
  });
});
