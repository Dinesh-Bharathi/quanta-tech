import { NextResponse } from "next/server"
import { checkAuth } from "@/lib/auth"
import { AuditLogger, AUDIT_ACTIONS } from "@/lib/audit"
import { encryptApiData } from "@/lib/encryption"

export async function GET(request) {
  try {
    const auth = checkAuth()
    if (!auth.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Mock inventory data - in real app, fetch from database
    const inventory = [
      {
        id: 1,
        name: "iPhone 15 Pro",
        sku: "IPH15P-128-BLK",
        category: "Electronics",
        stock: 45,
        price: 999.99,
        status: "In Stock",
        warehouseId: 1,
        organizationId: auth.organization.id,
      },
      // ... more products
    ]

    // Filter by organization
    const orgInventory = inventory.filter((item) => item.organizationId === auth.organization.id)

    // Encrypt sensitive data if needed
    const encryptedData = encryptApiData(orgInventory, process.env.ENCRYPTION_KEY)

    return NextResponse.json({
      data: orgInventory,
      encrypted: encryptedData,
    })
  } catch (error) {
    console.error("Inventory API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const auth = checkAuth()
    if (!auth.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()

    // Validate required fields
    const { name, sku, category, price, stock } = body
    if (!name || !sku || !category || !price || stock === undefined) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Create new product
    const newProduct = {
      id: Date.now(), // In real app, use proper ID generation
      name,
      sku,
      category,
      price: Number.parseFloat(price),
      stock: Number.parseInt(stock),
      status: stock > 0 ? "In Stock" : "Out of Stock",
      organizationId: auth.organization.id,
      createdAt: new Date().toISOString(),
      createdBy: auth.user.id,
    }

    // Log audit event
    await AuditLogger.log(AUDIT_ACTIONS.PRODUCT_CREATED, auth.user.id, auth.organization.id, { productName: name, sku })

    return NextResponse.json({ data: newProduct }, { status: 201 })
  } catch (error) {
    console.error("Create product error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
