import { createClient } from "@supabase/supabase-js";

// Load environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types for our tables
export interface Order {
  id: string;
  client_name: string;
  phone_number: string;
  invitation_type?: string | null;
  quantity?: number | null;
  order_date: string;
  created_at: string;
}

export interface Settings {
  id: number;
  max_capacity: number;
  updated_at: string;
}

// ==================== ORDERS CRUD Functions ====================
export const fetchOrders = async (): Promise<Order[]> => {
  try {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("order_date", { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw error;
  }
};

export const addOrder = async (order: Omit<Order, "id" | "created_at">): Promise<Order> => {
  try {
    const { data, error } = await supabase
      .from("orders")
      .insert([order])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error adding order:", error);
    throw error;
  }
};

export const updateOrder = async (
  id: string, 
  updates: Partial<Omit<Order, "id" | "created_at">>
): Promise<Order> => {
  try {
    const { data, error } = await supabase
      .from("orders")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error updating order:", error);
    throw error;
  }
};

export const deleteOrder = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from("orders")
      .delete()
      .eq("id", id);

    if (error) throw error;
  } catch (error) {
    console.error("Error deleting order:", error);
    throw error;
  }
};

export const deleteOldOrders = async (daysOld: number = 30): Promise<void> => {
  try {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);

    const { error } = await supabase
      .from("orders")
      .delete()
      .lt("order_date", cutoffDate.toISOString().split("T")[0]);

    if (error) throw error;
  } catch (error) {
    console.error("Error deleting old orders:", error);
    throw error;
  }
};

// ==================== SETTINGS Functions ====================
export const fetchSettings = async (): Promise<Settings> => {
  try {
    const { data, error } = await supabase
      .from("settings")
      .select("*")
      .eq("id", 1)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error fetching settings:", error);
    // Fallback to default if settings not found
    return { id: 1, max_capacity: 10, updated_at: new Date().toISOString() };
  }
};

export const updateMaxCapacity = async (newCapacity: number): Promise<Settings> => {
  try {
    const { data, error } = await supabase
      .from("settings")
      .update({ max_capacity: newCapacity, updated_at: new Date().toISOString() })
      .eq("id", 1)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error updating max capacity:", error);
    throw error;
  }
};
