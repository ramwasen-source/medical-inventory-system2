const express = require('express');
const { sql } = require('../db');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const result = await sql.query`
      SELECT
        Id,
        Name,
        Category,
        Quantity,
        Type,
        CreatedAt,
        UpdatedAt
      FROM InventoryItems
      ORDER BY Id DESC
    `;

    res.json(result.recordset);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: 'Failed to retrieve inventory items'
    });
  }
});

router.get('/recent-issues', async (req, res) => {
  try {
    const result = await sql.query`
      SELECT TOP 5
        t.Id,
        i.Name,
        i.Category,
        t.QuantityIssued,
        t.CreatedAt
      FROM InventoryTransactions t
      INNER JOIN InventoryItems i
        ON t.InventoryItemId = i.Id
      ORDER BY t.CreatedAt DESC
    `;

    res.json(result.recordset);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: 'Failed to retrieve recent issued items'
    });
  }
});

router.post('/', async (req, res) => {
  try {
    const { name, category, quantity, type } = req.body;

    if (!name || !category || quantity === undefined || !type) {
      return res.status(400).json({
        message: 'All fields are required'
      });
    }

    const result = await sql.query`
      INSERT INTO InventoryItems
        (Name, Category, Quantity, Type)
      OUTPUT
        INSERTED.Id,
        INSERTED.Name,
        INSERTED.Category,
        INSERTED.Quantity,
        INSERTED.Type,
        INSERTED.CreatedAt,
        INSERTED.UpdatedAt
      VALUES
        (${name}, ${category}, ${quantity}, ${type})
    `;

    res.status(201).json({
      message: 'Inventory item created successfully',
      item: result.recordset[0]
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: 'Failed to create inventory item'
    });
  }
});

router.put('/:id/issue', async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    if (quantity === undefined || quantity < 1) {
      return res.status(400).json({
        message: 'Issue quantity must be at least 1'
      });
    }

    const result = await sql.query`
      UPDATE InventoryItems
      SET
        Quantity = Quantity - ${quantity},
        UpdatedAt = GETDATE()
      OUTPUT
        INSERTED.Id,
        INSERTED.Name,
        INSERTED.Category,
        INSERTED.Quantity,
        INSERTED.Type,
        INSERTED.CreatedAt,
        INSERTED.UpdatedAt
      WHERE Id = ${id}
        AND Quantity >= ${quantity}
    `;

    if (result.recordset.length === 0) {
      return res.status(400).json({
        message: 'Inventory item not found or insufficient quantity'
      });
    }

    await sql.query`
      INSERT INTO InventoryTransactions
        (InventoryItemId, QuantityIssued)
      VALUES
        (${id}, ${quantity})
    `;

    res.json({
      message: 'Inventory quantity issued successfully',
      item: result.recordset[0]
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: 'Failed to issue inventory quantity'
    });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, category, quantity, type } = req.body;

    if (!name || !category || quantity === undefined || !type) {
      return res.status(400).json({
        message: 'All fields are required'
      });
    }

    const result = await sql.query`
      UPDATE InventoryItems
      SET
        Name = ${name},
        Category = ${category},
        Quantity = ${quantity},
        Type = ${type},
        UpdatedAt = GETDATE()
      OUTPUT
        INSERTED.Id,
        INSERTED.Name,
        INSERTED.Category,
        INSERTED.Quantity,
        INSERTED.Type,
        INSERTED.CreatedAt,
        INSERTED.UpdatedAt
      WHERE Id = ${id}
    `;

    if (result.recordset.length === 0) {
      return res.status(404).json({
        message: 'Inventory item not found'
      });
    }

    res.json({
      message: 'Inventory item updated successfully',
      item: result.recordset[0]
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: 'Failed to update inventory item'
    });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await sql.query`
      DELETE FROM InventoryItems
      OUTPUT
        DELETED.Id,
        DELETED.Name,
        DELETED.Category,
        DELETED.Quantity,
        DELETED.Type
      WHERE Id = ${id}
    `;

    if (result.recordset.length === 0) {
      return res.status(404).json({
        message: 'Inventory item not found'
      });
    }

    res.json({
      message: 'Inventory item deleted successfully',
      item: result.recordset[0]
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: 'Failed to delete inventory item'
    });
  }
});

module.exports = router;