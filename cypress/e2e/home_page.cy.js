describe("The Home Page", () => {
  it("successfully loads", () => {
    cy.visit("/signup");
    cy.contains("signup").click();
    cy.url().should("include", "/signup");
    cy.get("#first-name-input").type("Tester");
    cy.get("#first-name-input").should("have.value", "Tester");
    cy.get("#last-name-input").type("Senior");
    cy.get("#last-name-input").should("have.value", "Senior");
    cy.get("#email-input").type("test@gmail.com");
    cy.get("#email-input").should("have.value", "test@gmail.com");
    cy.get("#password-input").type("12345");
    cy.get("#password-input").should("have.value", "12345");
    cy.get("[data-testid=signup-button]").click();

    cy.url().should("eq", "http://localhost:8081/");
    cy.contains("Tester Senior");
  });
});
