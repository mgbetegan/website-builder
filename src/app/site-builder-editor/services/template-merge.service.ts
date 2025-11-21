// 🔀 TEMPLATE MERGE SERVICE - Merges template + couple data + theme
// Transforms template slots into real, renderable content

import { Injectable } from '@angular/core';
import { Block, Template, CoupleData, Theme, MergedSite, FAQ, RSVPField } from '../models';

@Injectable({
  providedIn: 'root'
})
export class TemplateMergeService {
  /**
   * Main merge function - transforms template into renderable site
   */
  mergeTemplate(template: Template, coupleData: CoupleData, theme: Theme): MergedSite {
    // Clone the template structure to avoid mutations
    const mergedStructure = this.processBlocks(template.structure, coupleData);

    return {
      structure: mergedStructure,
      theme: theme,
      metadata: {
        couple_name: coupleData.couple_name,
        wedding_date: coupleData.wedding_date,
        slug: coupleData.couple_name?.toLowerCase().replace(/\s+/g, '-')
      }
    };
  }

  /**
   * Process all blocks recursively
   */
  private processBlocks(blocks: Block[], coupleData: CoupleData): Block[] {
    return blocks.map(block => this.processBlock(block, coupleData));
  }

  /**
   * Process a single block - replace slots and generate dynamic children
   */
  private processBlock(block: Block, coupleData: CoupleData): Block {
    const processedProperties = this.processProperties(block.properties, coupleData);

    let processedChildren: Block[] | undefined;

    // Handle dynamic children generation
    if (block.children === undefined || block.children.length === 0) {
      // Check if this block type needs dynamic children
      if (block.type === 'faq_section') {
        processedChildren = this.generateFAQChildren(coupleData);
      } else if (block.type === 'couple_section') {
        processedChildren = this.generateCoupleChildren(coupleData);
      }
    } else if (Array.isArray(block.children)) {
      // Process existing children recursively
      processedChildren = this.processBlocks(block.children, coupleData);
    }

    return {
      ...block,
      properties: processedProperties,
      children: processedChildren
    };
  }

  /**
   * Process properties - replace xxxSlot with actual data
   */
  private processProperties(properties: Record<string, any>, coupleData: CoupleData): Record<string, any> {
    const processed: Record<string, any> = {};

    for (const [key, value] of Object.entries(properties)) {
      // Check if this is a slot (ends with "Slot")
      if (key.endsWith('Slot') && typeof value === 'string') {
        // Extract the data key from the slot
        const dataKey = value;
        const actualValue = coupleData[dataKey];

        // Remove "Slot" suffix to get the actual property name
        const propertyName = key.replace(/Slot$/, '');
        processed[propertyName] = actualValue !== undefined ? actualValue : '';
      } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        // Recursively process nested objects
        processed[key] = this.processProperties(value, coupleData);
      } else {
        // Keep the value as-is
        processed[key] = value;
      }
    }

    return processed;
  }

  /**
   * Generate FAQ children from couple data
   */
  private generateFAQChildren(coupleData: CoupleData): Block[] {
    const faqs: FAQ[] = coupleData.faqs || [];

    return faqs.map((faq, index) => ({
      id: `faq-item-${index}`,
      type: 'accordion_item' as const,
      properties: {
        question: faq.question,
        answer: faq.answer,
        open: faq.open || false
      }
    }));
  }

  /**
   * Generate couple section children (person bio blocks)
   */
  private generateCoupleChildren(coupleData: CoupleData): Block[] {
    const children: Block[] = [];

    // Add bride bio if available
    if (coupleData.bride_name) {
      children.push({
        id: 'bride-bio',
        type: 'person_bio' as const,
        properties: {
          name: coupleData.bride_name,
          role: 'La Mariée',
          image: coupleData.bride_image || '/assets/default-avatar.jpg',
          bio: coupleData.bride_bio || '',
          borderColor: '#D4AF37',
          imagePosition: 'left'
        }
      });
    }

    // Add groom bio if available
    if (coupleData.groom_name) {
      children.push({
        id: 'groom-bio',
        type: 'person_bio' as const,
        properties: {
          name: coupleData.groom_name,
          role: 'Le Marié',
          image: coupleData.groom_image || '/assets/default-avatar.jpg',
          bio: coupleData.groom_bio || '',
          borderColor: '#8B7355',
          imagePosition: 'right'
        }
      });
    }

    return children;
  }

  /**
   * Validate that all required fields are present
   */
  validateCoupleData(template: Template, coupleData: CoupleData): string[] {
    const errors: string[] = [];

    // Check required fields from template field definitions
    const requiredFields = template.fieldDefinitions
      .filter(field => field.required)
      .map(field => field.name);

    for (const fieldName of requiredFields) {
      const value = coupleData[fieldName];

      if (value === undefined || value === null || value === '') {
        errors.push(`Le champ "${fieldName}" est requis`);
      }

      // Special validation for arrays
      if (Array.isArray(value) && value.length === 0) {
        errors.push(`Le champ "${fieldName}" doit contenir au moins un élément`);
      }
    }

    return errors;
  }

  /**
   * Get all slot names from template structure
   */
  getSlotNames(template: Template): string[] {
    const slots: Set<string> = new Set();

    const extractSlots = (blocks: Block[]) => {
      for (const block of blocks) {
        // Check properties for slots
        for (const [key, value] of Object.entries(block.properties)) {
          if (key.endsWith('Slot') && typeof value === 'string') {
            slots.add(value);
          }
        }

        // Recursively check children
        if (block.children) {
          extractSlots(block.children);
        }
      }
    };

    extractSlots(template.structure);
    return Array.from(slots);
  }

  /**
   * Preview a single block with data
   */
  previewBlock(block: Block, coupleData: CoupleData): Block {
    return this.processBlock(block, coupleData);
  }

  /**
   * Check if template has all required slots filled
   */
  hasAllRequiredSlots(template: Template, coupleData: CoupleData): boolean {
    const slotNames = this.getSlotNames(template);
    const requiredSlots = slotNames.filter(slot => {
      const field = template.fieldDefinitions.find(f => f.name === slot);
      return field?.required || false;
    });

    return requiredSlots.every(slot => {
      const value = coupleData[slot];
      return value !== undefined && value !== null && value !== '';
    });
  }
}
