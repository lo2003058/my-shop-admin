export interface Tier {
  id: number;
  name: string;
  requiredPoints: number;
}

export interface TiersData {
  tiers: Tier[];
}

export interface TierFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  editTier?: Tier | null;
}

export interface TierFormData {
  name: string;
  requiredPoints: number;
}

export interface TierFormProps {
  onSave: (serializedData: TierFormData) => Promise<void>;
  initialData?: Partial<TierFormData>;
  isEditMode?: boolean;
}
