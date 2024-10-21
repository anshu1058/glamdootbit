import { SecretClient } from "@azure/keyvault-secrets";
import { InteractiveBrowserCredential } from "@azure/identity";

const keyVaultName = "glamdevrgkeyvault";
const vaultUrl = `https://${keyVaultName}.vault.azure.net`;

const credential = new InteractiveBrowserCredential({
  tenantId: "1de61f46-fc12-4067-ab1d-147eb7e21025", // Replace with your Azure AD tenant ID
  clientId: "8279f071-c18e-470e-87fc-7f4c1cca6245", // Replace with your Azure AD Application (client) ID
});

const secretClient = new SecretClient(vaultUrl, credential);

export const getKeyVaultSecret = async (secretName) => {
  try {
    const secret = await secretClient.getSecret(secretName);
    return secret.value;
  } catch (error) {
    console.error("Error fetching Key Vault secret:", error.message);
    throw error;
  }
};
