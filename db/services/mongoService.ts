import { Document, Model, FilterQuery, UpdateQuery } from "mongoose";
import Doc from "../models/mongo/Doc";

// Generic MongoDB service class
export class MongoService<T extends Document> {
  protected model: Model<T>;

  constructor(model: Model<T>) {
    this.model = model;
  }

  // Create a new document
  async create(data: Partial<T>): Promise<T> {
    try {
      const document = new this.model(data);
      return await document.save();
    } catch (error) {
      throw new Error(`Failed to create document: ${error}`);
    }
  }

  // Create or update a document (upsert)
  async upsert(query: FilterQuery<T>, data: Partial<T>): Promise<T> {
    try {
      return await this.model.findOneAndUpdate(
        query,
        data,
        { 
          new: true, 
          upsert: true, 
          setDefaultsOnInsert: true 
        }
      );
    } catch (error) {
      throw new Error(`Failed to upsert document: ${error}`);
    }
  }

  // Find a document by ID
  async findById(id: string): Promise<T | null> {
    try {
      return await this.model.findById(id);
    } catch (error) {
      throw new Error(`Failed to find document by ID: ${error}`);
    }
  }

  // Find documents by query
  async find(query: FilterQuery<T> = {}, limit?: number, skip?: number): Promise<T[]> {
    try {
      let queryBuilder = this.model.find(query);
      
      if (skip) queryBuilder = queryBuilder.skip(skip);
      if (limit) queryBuilder = queryBuilder.limit(limit);
      
      return await queryBuilder.exec();
    } catch (error) {
      throw new Error(`Failed to find documents: ${error}`);
    }
  }

  // Find one document by query
  async findOne(query: FilterQuery<T>): Promise<T | null> {
    try {
      return await this.model.findOne(query);
    } catch (error) {
      throw new Error(`Failed to find document: ${error}`);
    }
  }

  // Update a document by ID
  async updateById(id: string, update: UpdateQuery<T>): Promise<T | null> {
    try {
      return await this.model.findByIdAndUpdate(id, update, { new: true });
    } catch (error) {
      throw new Error(`Failed to update document: ${error}`);
    }
  }

  // Update documents by query
  async updateMany(query: FilterQuery<T>, update: UpdateQuery<T>): Promise<number> {
    try {
      const result = await this.model.updateMany(query, update);
      return result.modifiedCount;
    } catch (error) {
      throw new Error(`Failed to update documents: ${error}`);
    }
  }

  // Delete a document by ID
  async deleteById(id: string): Promise<boolean> {
    try {
      const result = await this.model.findByIdAndDelete(id);
      return !!result;
    } catch (error) {
      throw new Error(`Failed to delete document: ${error}`);
    }
  }

  // Delete documents by query
  async deleteMany(query: FilterQuery<T>): Promise<number> {
    try {
      const result = await this.model.deleteMany(query);
      return result.deletedCount;
    } catch (error) {
      throw new Error(`Failed to delete documents: ${error}`);
    }
  }

  // Count documents
  async count(query: FilterQuery<T> = {}): Promise<number> {
    try {
      return await this.model.countDocuments(query);
    } catch (error) {
      throw new Error(`Failed to count documents: ${error}`);
    }
  }

  // Check if document exists
  async exists(query: FilterQuery<T>): Promise<boolean> {
    try {
      const count = await this.model.countDocuments(query);
      return count > 0;
    } catch (error) {
      throw new Error(`Failed to check document existence: ${error}`);
    }
  }
}