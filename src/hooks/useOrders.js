import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

/**
 * Hook to fetch and subscribe to orders in real-time.
 */
export function useOrders(initialFilter = 'pending') {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState(initialFilter);

  const fetchOrders = useCallback(async () => {
    if (!import.meta.env.VITE_SUPABASE_URL) {
      setLoading(false);
      return [];
    }

    setLoading(true);
    try {
      let query = supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (filter !== 'all') {
        query = query.eq('status', filter);
      }

      const { data, error } = await query;
      if (error) throw error;
      setOrders(data || []);
      return data;
    } catch (err) {
      setError(err.message);
      console.error('Error fetching orders:', err);
      return [];
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchOrders();

    if (!import.meta.env.VITE_SUPABASE_URL) return;

    // Subscribe to real-time changes
    const channel = supabase
      .channel('orders-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'orders' },
        () => {
          fetchOrders();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchOrders]);

  return { orders, loading, error, filter, setFilter, refresh: fetchOrders };
}

/**
 * Hook to update order status.
 */
export function useUpdateOrder() {
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState(null);

  const updateOrderStatus = async (orderId, newStatus) => {
    setUpdating(true);
    setError(null);

    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId);

      if (error) throw error;
      return true;
    } catch (err) {
      setError(err.message);
      console.error('Error updating order:', err);
      return false;
    } finally {
      setUpdating(false);
    }
  };

  return { updateOrderStatus, updating, error };
}

/**
 * Hook to manage menu items in Supabase.
 */
export function useMenuItems() {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    async function fetchMenuItems() {
      if (!import.meta.env.VITE_SUPABASE_URL) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('menu_items')
          .select('*')
          .order('category', { ascending: true })
          .order('sort_order', { ascending: true });

        if (error) throw error;
        if (mounted) setMenuItems(data || []);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching menu items:', err);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchMenuItems();
    return () => { mounted = false; };
  }, []);

  const addMenuItem = async (item) => {
    try {
      const { data, error } = await supabase
        .from('menu_items')
        .insert([item])
        .select()
        .single();

      if (error) throw error;
      setMenuItems(prev => [...prev, data]);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const updateMenuItem = async (id, updates) => {
    try {
      const { error } = await supabase
        .from('menu_items')
        .update(updates)
        .eq('id', id);

      if (error) throw error;
      setMenuItems(prev => prev.map(item => item.id === id ? { ...item, ...updates } : item));
      return true;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const deleteMenuItem = async (id) => {
    try {
      const { error } = await supabase
        .from('menu_items')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setMenuItems(prev => prev.filter(item => item.id !== id));
      return true;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  return { menuItems, loading, error, addMenuItem, updateMenuItem, deleteMenuItem };
}