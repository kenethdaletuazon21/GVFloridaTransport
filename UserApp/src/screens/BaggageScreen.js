import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, TextInput, Switch } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

const BAG_TYPES = ['Suitcase', 'Backpack', 'Box/Parcel', 'Bag', 'Other'];
const WEIGHT_OPTIONS = [
  { label: 'Up to 10 kg (Light)', value: 10, fee: 0 },
  { label: '10–15 kg', value: 15, fee: 0 },
  { label: '15–20 kg (Free)', value: 20, fee: 0 },
  { label: '20–25 kg (+₱50)', value: 25, fee: 50 },
  { label: '25–30 kg (+₱100)', value: 30, fee: 100 },
];

export default function BaggageScreen({ navigation, route }) {
  const { trip, seat } = route.params;
  const [bagCount, setBagCount] = useState(1);
  const [weightIdx, setWeightIdx] = useState(2);
  const [bags, setBags] = useState([{ description: '', type: 'Suitcase' }]);
  const [valuables, setValuables] = useState('');
  const [fragile, setFragile] = useState(false);
  const [perishable, setPerishable] = useState(false);
  const [oversized, setOversized] = useState(false);

  const updateBagCount = (count) => {
    setBagCount(count);
    const newBags = Array.from({ length: count }, (_, i) =>
      bags[i] || { description: '', type: 'Suitcase' }
    );
    setBags(newBags);
  };

  const updateBag = (index, field, value) => {
    const updated = [...bags];
    updated[index] = { ...updated[index], [field]: value };
    setBags(updated);
  };

  const excessFee = WEIGHT_OPTIONS[weightIdx].fee;

  const handleContinue = () => {
    navigation.navigate('Payment', {
      trip,
      seat,
      baggage: {
        count: bagCount,
        weight: WEIGHT_OPTIONS[weightIdx].value,
        excessFee,
        bags: bags.slice(0, bagCount),
        valuables,
        specialHandling: { fragile, perishable, oversized },
      },
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Header info */}
        <View style={styles.headerCard}>
          <Icon name="package" size={22} color="#D90045" />
          <View style={styles.headerInfo}>
            <Text style={styles.headerTitle}>Baggage Declaration</Text>
            <Text style={styles.headerSub}>Seat #{seat} — {trip.route_name || 'Trip'}</Text>
          </View>
        </View>

        {/* Free Allowance Banner */}
        <View style={styles.banner}>
          <Icon name="info" size={16} color="#27ae60" />
          <Text style={styles.bannerText}>20 kg free baggage allowance per passenger</Text>
        </View>

        {/* Bag Count */}
        <Text style={styles.sectionTitle}>Number of Bags</Text>
        <View style={styles.countRow}>
          {[0, 1, 2, 3].map(n => (
            <TouchableOpacity
              key={n}
              style={[styles.countBtn, bagCount === n && styles.countBtnActive]}
              onPress={() => updateBagCount(n)}
            >
              <Text style={[styles.countBtnText, bagCount === n && styles.countBtnTextActive]}>
                {n === 0 ? 'None' : n}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Weight */}
        <Text style={styles.sectionTitle}>Estimated Total Weight</Text>
        <View style={styles.weightList}>
          {WEIGHT_OPTIONS.map((opt, i) => (
            <TouchableOpacity
              key={i}
              style={[styles.weightOption, weightIdx === i && styles.weightOptionActive]}
              onPress={() => setWeightIdx(i)}
            >
              <View style={[styles.radio, weightIdx === i && styles.radioActive]} />
              <Text style={[styles.weightLabel, weightIdx === i && styles.weightLabelActive]}>{opt.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
        {excessFee > 0 && (
          <View style={styles.feeAlert}>
            <Icon name="alert-circle" size={14} color="#D90045" />
            <Text style={styles.feeText}>Excess baggage fee: ₱{excessFee}</Text>
          </View>
        )}

        {/* Bag Details */}
        {bagCount > 0 && (
          <>
            <Text style={styles.sectionTitle}>Bag Details</Text>
            {bags.slice(0, bagCount).map((bag, i) => (
              <View key={i} style={styles.bagCard}>
                <Text style={styles.bagLabel}>Bag {i + 1}</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Description (e.g., Black rolling suitcase)"
                  placeholderTextColor="#aaa"
                  value={bag.description}
                  onChangeText={(v) => updateBag(i, 'description', v)}
                />
                <View style={styles.typeRow}>
                  {BAG_TYPES.map(type => (
                    <TouchableOpacity
                      key={type}
                      style={[styles.typeChip, bag.type === type && styles.typeChipActive]}
                      onPress={() => updateBag(i, 'type', type)}
                    >
                      <Text style={[styles.typeChipText, bag.type === type && styles.typeChipTextActive]}>{type}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            ))}
          </>
        )}

        {/* Valuable Items */}
        <Text style={styles.sectionTitle}>Declare Valuable Items (Optional)</Text>
        <TextInput
          style={[styles.input, styles.textarea]}
          placeholder="e.g., Laptop ₱45,000; Jewelry ₱15,000"
          placeholderTextColor="#aaa"
          value={valuables}
          onChangeText={setValuables}
          multiline
          numberOfLines={3}
        />
        <Text style={styles.hint}>Declaring valuables enables insurance coverage. Max declared value: ₱100,000</Text>

        {/* Special Handling */}
        <Text style={styles.sectionTitle}>Special Handling</Text>
        <View style={styles.switchRow}>
          <View style={styles.switchItem}>
            <Switch value={fragile} onValueChange={setFragile} trackColor={{ true: '#D90045' }} thumbColor={fragile ? '#fff' : '#f4f3f4'} />
            <View><Text style={styles.switchLabel}>Fragile Items</Text><Text style={styles.switchSub}>Handle with care</Text></View>
          </View>
          <View style={styles.switchItem}>
            <Switch value={perishable} onValueChange={setPerishable} trackColor={{ true: '#D90045' }} thumbColor={perishable ? '#fff' : '#f4f3f4'} />
            <View><Text style={styles.switchLabel}>Perishable Goods</Text><Text style={styles.switchSub}>Temperature sensitive</Text></View>
          </View>
          <View style={styles.switchItem}>
            <Switch value={oversized} onValueChange={setOversized} trackColor={{ true: '#D90045' }} thumbColor={oversized ? '#fff' : '#f4f3f4'} />
            <View><Text style={styles.switchLabel}>Oversized Item</Text><Text style={styles.switchSub}>Larger than standard</Text></View>
          </View>
        </View>

        {/* Policy */}
        <View style={styles.policy}>
          <Text style={styles.policyTitle}>Baggage Policy</Text>
          {[
            '20 kg free baggage per passenger',
            'Excess: ₱50 per additional 5 kg',
            'Maximum single item: 30 kg',
            'Prohibited: flammable, hazardous, illegal items',
          ].map((item, i) => (
            <View key={i} style={styles.policyRow}>
              <Icon name="check-circle" size={14} color="#27ae60" />
              <Text style={styles.policyText}>{item}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Bottom Bar */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={18} color="#D90045" />
          <Text style={styles.backBtnText}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.continueBtn} onPress={handleContinue}>
          <Text style={styles.continueBtnText}>Continue to Payment</Text>
          <Icon name="arrow-right" size={18} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  scroll: { padding: 16, paddingBottom: 100 },
  headerCard: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#fff', padding: 16, borderRadius: 12, marginBottom: 12, elevation: 2 },
  headerInfo: { flex: 1 },
  headerTitle: { fontSize: 16, fontWeight: '700', color: '#1a1a1a' },
  headerSub: { fontSize: 13, color: '#888', marginTop: 2 },
  banner: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#e8f5e9', padding: 12, borderRadius: 8, marginBottom: 20 },
  bannerText: { fontSize: 13, color: '#27ae60', fontWeight: '600' },
  sectionTitle: { fontSize: 14, fontWeight: '700', color: '#1a1a1a', marginBottom: 10, marginTop: 8 },
  countRow: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  countBtn: { flex: 1, padding: 12, borderRadius: 8, backgroundColor: '#fff', alignItems: 'center', borderWidth: 2, borderColor: '#e8e8e8' },
  countBtnActive: { borderColor: '#D90045', backgroundColor: 'rgba(217,0,69,0.05)' },
  countBtnText: { fontSize: 14, fontWeight: '600', color: '#666' },
  countBtnTextActive: { color: '#D90045' },
  weightList: { gap: 8, marginBottom: 12 },
  weightOption: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#fff', padding: 14, borderRadius: 8, borderWidth: 2, borderColor: '#e8e8e8' },
  weightOptionActive: { borderColor: '#D90045', backgroundColor: 'rgba(217,0,69,0.05)' },
  radio: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: '#ccc' },
  radioActive: { borderColor: '#D90045', backgroundColor: '#D90045', shadowColor: '#D90045', shadowOpacity: 0.3, shadowRadius: 4 },
  weightLabel: { fontSize: 14, color: '#333' },
  weightLabelActive: { color: '#D90045', fontWeight: '600' },
  feeAlert: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#fce4ec', padding: 10, borderRadius: 8, marginBottom: 10 },
  feeText: { fontSize: 13, color: '#D90045', fontWeight: '600' },
  bagCard: { backgroundColor: '#fff', padding: 16, borderRadius: 10, marginBottom: 10, borderWidth: 1, borderColor: '#e8e8e8' },
  bagLabel: { fontSize: 13, fontWeight: '700', color: '#333', marginBottom: 8 },
  input: { borderWidth: 1, borderColor: '#e0e0e0', borderRadius: 8, padding: 12, fontSize: 14, color: '#333', backgroundColor: '#fafafa' },
  textarea: { minHeight: 70, textAlignVertical: 'top', marginBottom: 4 },
  typeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 10 },
  typeChip: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20, backgroundColor: '#f0f0f0' },
  typeChipActive: { backgroundColor: '#D90045' },
  typeChipText: { fontSize: 12, fontWeight: '600', color: '#666' },
  typeChipTextActive: { color: '#fff' },
  hint: { fontSize: 12, color: '#999', marginTop: 4, marginBottom: 8 },
  switchRow: { gap: 10, marginBottom: 16 },
  switchItem: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#fff', padding: 14, borderRadius: 10 },
  switchLabel: { fontSize: 14, fontWeight: '600', color: '#333' },
  switchSub: { fontSize: 12, color: '#999' },
  policy: { backgroundColor: '#fff8e1', padding: 16, borderRadius: 10, borderWidth: 1, borderColor: '#ffe082', marginTop: 4 },
  policyTitle: { fontSize: 14, fontWeight: '700', color: '#856404', marginBottom: 10 },
  policyRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 },
  policyText: { fontSize: 13, color: '#856404' },
  bottomBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#e8e8e8' },
  backBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, padding: 12 },
  backBtnText: { fontSize: 15, fontWeight: '600', color: '#D90045' },
  continueBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#D90045', paddingVertical: 14, paddingHorizontal: 24, borderRadius: 10 },
  continueBtnText: { color: '#fff', fontSize: 15, fontWeight: '700' },
});
