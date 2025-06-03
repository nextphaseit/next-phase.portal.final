interface SharePointConfig {
  siteUrl: string
  clientId: string
  clientSecret: string
  tenantId: string
}

interface SharePointListItem {
  Id: number
  [key: string]: any
}

export class SharePointService {
  private config: SharePointConfig
  private accessToken: string | null = null
  private tokenExpiry: Date | null = null

  constructor(config: SharePointConfig) {
    this.config = config
  }

  private async getAccessToken(): Promise<string> {
    if (this.accessToken && this.tokenExpiry && new Date() < this.tokenExpiry) {
      return this.accessToken
    }

    try {
      const tokenUrl = `https://login.microsoftonline.com/${this.config.tenantId}/oauth2/v2.0/token`

      const response = await fetch(tokenUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          grant_type: "client_credentials",
          client_id: this.config.clientId,
          client_secret: this.config.clientSecret,
          scope: `${this.config.siteUrl}/.default`,
        }),
      })

      if (!response.ok) {
        throw new Error(`Failed to get access token: ${response.statusText}`)
      }

      const data = await response.json()
      this.accessToken = data.access_token
      this.tokenExpiry = new Date(Date.now() + data.expires_in * 1000 - 60000) // Subtract 1 minute for safety

      return this.accessToken
    } catch (error) {
      console.error("Error getting SharePoint access token:", error)
      throw error
    }
  }

  async getListItems(
    listName: string,
    select?: string[],
    filter?: string,
    orderBy?: string,
  ): Promise<SharePointListItem[]> {
    try {
      const accessToken = await this.getAccessToken()

      let url = `${this.config.siteUrl}/_api/web/lists/getbytitle('${listName}')/items`

      const params = new URLSearchParams()
      if (select && select.length > 0) {
        params.append("$select", select.join(","))
      }
      if (filter) {
        params.append("$filter", filter)
      }
      if (orderBy) {
        params.append("$orderby", orderBy)
      }

      if (params.toString()) {
        url += `?${params.toString()}`
      }

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/json;odata=verbose",
        },
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch list items: ${response.statusText}`)
      }

      const data = await response.json()
      return data.d.results
    } catch (error) {
      console.error("Error fetching SharePoint list items:", error)
      throw error
    }
  }

  async updateListItem(listName: string, itemId: number, updates: Record<string, any>): Promise<boolean> {
    try {
      const accessToken = await this.getAccessToken()

      // First, get the form digest value
      const digestResponse = await fetch(`${this.config.siteUrl}/_api/contextinfo`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/json;odata=verbose",
        },
      })

      if (!digestResponse.ok) {
        throw new Error("Failed to get form digest")
      }

      const digestData = await digestResponse.json()
      const formDigest = digestData.d.GetContextWebInformation.FormDigestValue

      // Now update the item
      const updateResponse = await fetch(
        `${this.config.siteUrl}/_api/web/lists/getbytitle('${listName}')/items(${itemId})`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            Accept: "application/json;odata=verbose",
            "Content-Type": "application/json;odata=verbose",
            "X-RequestDigest": formDigest,
            "X-HTTP-Method": "MERGE",
            "If-Match": "*",
          },
          body: JSON.stringify(updates),
        },
      )

      return updateResponse.ok
    } catch (error) {
      console.error("Error updating SharePoint list item:", error)
      throw error
    }
  }

  async createListItem(listName: string, data: Record<string, any>): Promise<SharePointListItem | null> {
    try {
      const accessToken = await this.getAccessToken()

      // Get the form digest value
      const digestResponse = await fetch(`${this.config.siteUrl}/_api/contextinfo`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/json;odata=verbose",
        },
      })

      if (!digestResponse.ok) {
        throw new Error("Failed to get form digest")
      }

      const digestData = await digestResponse.json()
      const formDigest = digestData.d.GetContextWebInformation.FormDigestValue

      // Create the item
      const createResponse = await fetch(`${this.config.siteUrl}/_api/web/lists/getbytitle('${listName}')/items`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/json;odata=verbose",
          "Content-Type": "application/json;odata=verbose",
          "X-RequestDigest": formDigest,
        },
        body: JSON.stringify(data),
      })

      if (!createResponse.ok) {
        throw new Error(`Failed to create list item: ${createResponse.statusText}`)
      }

      const responseData = await createResponse.json()
      return responseData.d
    } catch (error) {
      console.error("Error creating SharePoint list item:", error)
      throw error
    }
  }
}

// Export a configured instance
export const sharePointService = new SharePointService({
  siteUrl: process.env.SHAREPOINT_SITE_URL || "https://yourtenant.sharepoint.com/sites/helpdesk",
  clientId: process.env.AZURE_AD_CLIENT_ID || "",
  clientSecret: process.env.AZURE_AD_CLIENT_SECRET || "",
  tenantId: process.env.AZURE_AD_TENANT_ID || "",
})
