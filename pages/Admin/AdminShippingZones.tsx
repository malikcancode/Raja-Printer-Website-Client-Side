import React, { useState, useEffect } from "react";
import {
  Package,
  MapPin,
  DollarSign,
  Clock,
  Plus,
  Edit2,
  Trash2,
  Power,
  PowerOff,
  AlertTriangle,
  Loader2,
  Save,
  X,
  Star,
  Weight,
} from "lucide-react";
import {
  getAllShippingZones,
  createShippingZone,
  updateShippingZone,
  toggleShippingZoneStatus,
  deleteShippingZone,
} from "../../apis/shipping";

interface ShippingZone {
  _id: string;
  name: string;
  cities: string[];
  country: string;
  province: string | null;
  basePrice: number;
  baseWeightKg: number;
  pricePerExtraKg: number;
  deliveryTimeMin: number;
  deliveryTimeMax: number;
  freeShippingThreshold: number | null;
  isActive: boolean;
  isDefault: boolean;
  priority: number;
  createdAt: string;
  updatedAt: string;
}

const AdminShippingZones: React.FC = () => {
  const [zones, setZones] = useState<ShippingZone[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingZone, setEditingZone] = useState<ShippingZone | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<{
    show: boolean;
    zoneId: string;
    zoneName: string;
    pendingCount?: number;
  } | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    cities: "",
    country: "Pakistan",
    province: null as string | null,
    basePrice: 0,
    baseWeightKg: 1,
    pricePerExtraKg: 0,
    deliveryTimeMin: 2,
    deliveryTimeMax: 5,
    freeShippingThreshold: null as number | null,
    isDefault: false,
    priority: 50,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchZones();
  }, []);

  const fetchZones = async () => {
    try {
      setLoading(true);
      const response = await getAllShippingZones();
      if (response.success) {
        setZones(response.data);
      }
    } catch (error: any) {
      console.error("Error fetching zones:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (zone?: ShippingZone) => {
    if (zone) {
      setEditingZone(zone);
      setFormData({
        name: zone.name,
        cities: zone.cities.join(", "),
        country: zone.country,
        province: zone.province || null,
        basePrice: zone.basePrice,
        baseWeightKg: zone.baseWeightKg,
        pricePerExtraKg: zone.pricePerExtraKg,
        deliveryTimeMin: zone.deliveryTimeMin,
        deliveryTimeMax: zone.deliveryTimeMax,
        freeShippingThreshold: zone.freeShippingThreshold,
        isDefault: zone.isDefault,
        priority: zone.priority,
      });
    } else {
      setEditingZone(null);
      setFormData({
        name: "",
        cities: "",
        country: "Pakistan",
        province: null,
        basePrice: 0,
        baseWeightKg: 1,
        pricePerExtraKg: 0,
        deliveryTimeMin: 2,
        deliveryTimeMax: 5,
        freeShippingThreshold: null,
        isDefault: false,
        priority: 50,
      });
    }
    setErrors({});
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingZone(null);
    setFormData({
      name: "",
      cities: "",
      country: "Pakistan",
      province: null,
      basePrice: 0,
      baseWeightKg: 1,
      pricePerExtraKg: 0,
      deliveryTimeMin: 2,
      deliveryTimeMax: 5,
      freeShippingThreshold: null,
      isDefault: false,
      priority: 50,
    });
    setErrors({});
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Zone name is required";
    }

    // Either cities or province must be provided
    if (!formData.cities.trim() && !formData.province) {
      newErrors.cities =
        "At least one city OR a province/region must be specified";
    }

    if (formData.basePrice < 0) {
      newErrors.basePrice = "Base price cannot be negative";
    }

    if (formData.baseWeightKg <= 0) {
      newErrors.baseWeightKg = "Base weight must be greater than 0";
    }

    if (formData.pricePerExtraKg < 0) {
      newErrors.pricePerExtraKg = "Price per kg cannot be negative";
    }

    if (formData.deliveryTimeMin < 0 || formData.deliveryTimeMax < 0) {
      newErrors.deliveryTime = "Delivery time cannot be negative";
    }

    if (formData.deliveryTimeMin > formData.deliveryTimeMax) {
      newErrors.deliveryTime = "Min delivery time cannot exceed max";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setSaving(true);

      const zoneData = {
        ...formData,
        cities: formData.cities
          .split(",")
          .map((city) => city.trim())
          .filter(Boolean),
        freeShippingThreshold: formData.freeShippingThreshold || null,
      };

      if (editingZone) {
        await updateShippingZone(editingZone._id, zoneData);
      } else {
        await createShippingZone(zoneData);
      }

      await fetchZones();
      handleCloseModal();
    } catch (error: any) {
      setErrors({ submit: error.message });
    } finally {
      setSaving(false);
    }
  };

  const handleToggleStatus = async (zoneId: string) => {
    try {
      const response = await toggleShippingZoneStatus(zoneId, false);

      if (response.requiresConfirmation) {
        const zone = zones.find((z) => z._id === zoneId);
        setConfirmDialog({
          show: true,
          zoneId,
          zoneName: zone?.name || "",
          pendingCount: response.pendingOrdersCount,
        });
      } else {
        await fetchZones();
      }
    } catch (error: any) {
      alert(error.message);
    }
  };

  const handleConfirmToggle = async () => {
    if (!confirmDialog) return;

    try {
      await toggleShippingZoneStatus(confirmDialog.zoneId, true);
      setConfirmDialog(null);
      await fetchZones();
    } catch (error: any) {
      alert(error.message);
    }
  };

  const handleDelete = async (zoneId: string) => {
    if (!confirm("Are you sure you want to delete this zone?")) return;

    try {
      await deleteShippingZone(zoneId);
      await fetchZones();
    } catch (error: any) {
      alert(error.message);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="animate-spin text-blue-600" size={48} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 flex items-center gap-3">
              <Package className="text-blue-600" />
              Shipping Zones
            </h1>
            <p className="text-gray-500 mt-1">
              Manage delivery areas and shipping rates
            </p>
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-lg"
          >
            <Plus size={20} />
            Add Zone
          </button>
        </div>

        {/* Zones Grid */}
        {zones.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center">
            <Package size={64} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              No Shipping Zones
            </h3>
            <p className="text-gray-500 mb-6">
              Create your first shipping zone to start managing deliveries
            </p>
            <button
              onClick={() => handleOpenModal()}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors"
            >
              Create Zone
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {zones.map((zone) => (
              <div
                key={zone._id}
                className={`bg-white rounded-xl p-6 shadow-sm border ${
                  zone.isActive
                    ? "border-gray-200"
                    : "border-gray-300 opacity-60"
                } hover:shadow-md transition-shadow`}
              >
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg font-extrabold text-gray-900">
                        {zone.name}
                      </h3>
                      {zone.isDefault && (
                        <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs font-bold rounded">
                          <Star size={12} className="inline" /> Default
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500">{zone.country}</p>
                  </div>
                  <button
                    onClick={() => handleToggleStatus(zone._id)}
                    className={`p-2 rounded-lg transition-colors ${
                      zone.isActive
                        ? "bg-green-100 text-green-600 hover:bg-green-200"
                        : "bg-gray-100 text-gray-400 hover:bg-gray-200"
                    }`}
                    title={zone.isActive ? "Active" : "Inactive"}
                  >
                    {zone.isActive ? (
                      <Power size={18} />
                    ) : (
                      <PowerOff size={18} />
                    )}
                  </button>
                </div>

                {/* Cities */}
                <div className="mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                    <MapPin size={16} />
                    <span className="font-bold">
                      {zone.province
                        ? `${zone.province} Province`
                        : "Specific Cities"}
                    </span>
                  </div>
                  {zone.province && (
                    <div className="mb-2">
                      <span className="px-3 py-1 bg-purple-100 text-purple-700 text-sm rounded-full font-bold">
                        📍 {zone.province} Region
                      </span>
                      <p className="text-xs text-gray-500 mt-1">
                        Auto-matches all {zone.province} cities
                      </p>
                    </div>
                  )}
                  <div className="flex flex-wrap gap-1">
                    {zone.cities.slice(0, 5).map((city, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded"
                      >
                        {city}
                      </span>
                    ))}
                    {zone.cities.length > 5 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                        +{zone.cities.length - 5} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Pricing */}
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 flex items-center gap-1">
                      <DollarSign size={14} /> Base Price
                    </span>
                    <span className="font-bold text-gray-900">
                      PKR {zone.basePrice}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 flex items-center gap-1">
                      <Weight size={14} /> Base Weight
                    </span>
                    <span className="font-bold text-gray-900">
                      {zone.baseWeightKg} kg
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 flex items-center gap-1">
                      <Weight size={14} /> Extra/kg
                    </span>
                    <span className="font-bold text-gray-900">
                      PKR {zone.pricePerExtraKg}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 flex items-center gap-1">
                      <Clock size={14} /> Delivery
                    </span>
                    <span className="font-bold text-gray-900">
                      {zone.deliveryTimeMin}-{zone.deliveryTimeMax} days
                    </span>
                  </div>
                  {zone.freeShippingThreshold && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Free Shipping</span>
                      <span className="font-bold text-green-600">
                        Above PKR {zone.freeShippingThreshold}
                      </span>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-4 border-t border-gray-100">
                  <button
                    onClick={() => handleOpenModal(zone)}
                    className="flex-1 py-2 bg-blue-50 text-blue-600 rounded-lg font-bold hover:bg-blue-100 transition-colors flex items-center justify-center gap-2"
                  >
                    <Edit2 size={16} />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(zone._id)}
                    className="px-4 py-2 bg-red-50 text-red-600 rounded-lg font-bold hover:bg-red-100 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white">
              <h2 className="text-2xl font-extrabold text-gray-900">
                {editingZone ? "Edit Shipping Zone" : "Create Shipping Zone"}
              </h2>
              <button
                onClick={handleCloseModal}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Zone Name */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Zone Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Lahore Zone, Punjab Zone"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                )}
              </div>

              {/* Cities */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Cities{" "}
                  {formData.province ? (
                    <span className="text-xs font-normal text-gray-500">
                      (Optional - Province will cover all cities)
                    </span>
                  ) : (
                    <span className="text-red-500">*</span>
                  )}
                </label>
                <textarea
                  value={formData.cities}
                  onChange={(e) =>
                    setFormData({ ...formData, cities: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Lahore, Karachi, Islamabad"
                  rows={3}
                />
                {errors.cities && (
                  <p className="text-red-500 text-sm mt-1">{errors.cities}</p>
                )}
                {formData.province && (
                  <p className="text-xs text-blue-600 mt-1">
                    💡 Tip: List major cities here for priority matching within
                    the province
                  </p>
                )}
              </div>

              {/* Country */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Country *
                </label>
                <input
                  type="text"
                  value={formData.country}
                  onChange={(e) =>
                    setFormData({ ...formData, country: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Province/Region (Optional) */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Province/Region (Optional)
                  <span className="text-xs font-normal text-gray-500 ml-2">
                    For regional zones covering entire provinces
                  </span>
                </label>
                <select
                  value={formData.province || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      province: e.target.value || null,
                    })
                  }
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                >
                  <option value="">None (Specific cities only)</option>
                  <option value="Punjab">Punjab</option>
                  <option value="Sindh">Sindh</option>
                  <option value="KPK">KPK (Khyber Pakhtunkhwa)</option>
                  <option value="Balochistan">Balochistan</option>
                  <option value="Gilgit-Baltistan">Gilgit-Baltistan</option>
                  <option value="AJK">AJK (Azad Jammu Kashmir)</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  📍 If selected, this zone will match all cities in the
                  province, even if not listed above
                </p>
              </div>

              {/* Priority */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Priority
                  <span className="text-xs font-normal text-gray-500 ml-2">
                    Lower number = higher priority (1-99)
                  </span>
                </label>
                <input
                  type="number"
                  value={formData.priority}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      priority: parseInt(e.target.value) || 50,
                    })
                  }
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="1"
                  max="99"
                  placeholder="50"
                />
                <p className="text-xs text-gray-500 mt-1">
                  💡 Recommended: Major cities = 1-10, Regional = 40-60, Default
                  = 99
                </p>
              </div>

              {/* Pricing Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Base Price (PKR) *
                  </label>
                  <input
                    type="number"
                    value={formData.basePrice}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        basePrice: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="0"
                    step="0.01"
                  />
                  {errors.basePrice && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.basePrice}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Base Weight (kg) *
                  </label>
                  <input
                    type="number"
                    value={formData.baseWeightKg}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        baseWeightKg: parseFloat(e.target.value) || 1,
                      })
                    }
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="0.1"
                    step="0.1"
                  />
                  {errors.baseWeightKg && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.baseWeightKg}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Price per Extra kg (PKR)
                  </label>
                  <input
                    type="number"
                    value={formData.pricePerExtraKg}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        pricePerExtraKg: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="0"
                    step="0.01"
                  />
                  {errors.pricePerExtraKg && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.pricePerExtraKg}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Free Shipping Above (PKR)
                  </label>
                  <input
                    type="number"
                    value={formData.freeShippingThreshold || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        freeShippingThreshold: e.target.value
                          ? parseFloat(e.target.value)
                          : null,
                      })
                    }
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="0"
                    step="0.01"
                    placeholder="Optional"
                  />
                </div>
              </div>

              {/* Delivery Time */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Min Delivery Days *
                  </label>
                  <input
                    type="number"
                    value={formData.deliveryTimeMin}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        deliveryTimeMin: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Max Delivery Days *
                  </label>
                  <input
                    type="number"
                    value={formData.deliveryTimeMax}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        deliveryTimeMax: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="0"
                  />
                </div>
              </div>
              {errors.deliveryTime && (
                <p className="text-red-500 text-sm">{errors.deliveryTime}</p>
              )}

              {/* Options */}
              <div className="space-y-3">
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={formData.isDefault}
                    onChange={(e) =>
                      setFormData({ ...formData, isDefault: e.target.checked })
                    }
                    className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-sm font-bold text-gray-700">
                    Set as Default/Remote Area Zone
                  </span>
                </label>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Priority (higher = matched first)
                  </label>
                  <input
                    type="number"
                    value={formData.priority}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        priority: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {errors.submit && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                  <p className="text-red-600 text-sm">{errors.submit}</p>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 py-3 border border-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition-colors"
                  disabled={saving}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save size={18} />
                      {editingZone ? "Update Zone" : "Create Zone"}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirmation Dialog */}
      {confirmDialog?.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-amber-100 rounded-full">
                <AlertTriangle className="text-amber-600" size={24} />
              </div>
              <h3 className="text-xl font-extrabold text-gray-900">
                Pending Orders Warning
              </h3>
            </div>

            <p className="text-gray-600 mb-6">
              Zone <strong>{confirmDialog.zoneName}</strong> has{" "}
              <strong>{confirmDialog.pendingCount}</strong> pending order(s).
              Disabling this zone will cancel these orders.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setConfirmDialog(null)}
                className="flex-1 py-3 border border-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmToggle}
                className="flex-1 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-colors"
              >
                Disable & Cancel Orders
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminShippingZones;
