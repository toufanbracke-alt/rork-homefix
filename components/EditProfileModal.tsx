import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  Image,
  ActivityIndicator,
} from 'react-native';
import { X, Plus, Minus, Camera } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { useUser } from '@/providers/UserProvider';
import { useLanguage } from '@/providers/LanguageProvider';

interface EditProfileModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function EditProfileModal({ visible, onClose }: EditProfileModalProps) {
  const { profile, updateProfile, userType } = useUser();
  const { t } = useLanguage();
  
  const [formData, setFormData] = useState({
    name: profile.name,
    profession: profile.profession,
    email: profile.email,
    phone: profile.phone,
    location: profile.location,
    about: profile.about,
    skills: [...profile.skills],
    avatar: profile.avatar,
  });
  
  const [newSkill, setNewSkill] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(t('common.error'), 'Permission to access media library is required');
        return;
      }

      setUploadingImage(true);
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setFormData(prev => ({
          ...prev,
          avatar: result.assets[0].uri
        }));
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert(t('common.error'), 'Failed to pick image');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSave = async () => {
    if (!formData.name.trim() || !formData.email.trim() || !formData.phone.trim() || !formData.location.trim()) {
      Alert.alert(t('common.error'), t('createJob.fillAllFields'));
      return;
    }

    if (userType === 'fixer' && !formData.profession.trim()) {
      Alert.alert(t('common.error'), t('createJob.fillAllFields'));
      return;
    }

    setIsLoading(true);
    try {
      await updateProfile({
        name: formData.name.trim(),
        profession: formData.profession.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        location: formData.location.trim(),
        about: formData.about.trim(),
        skills: formData.skills.filter(skill => skill.trim() !== ''),
        avatar: formData.avatar,
      });
      
      Alert.alert(t('common.success'), t('profile.profileUpdated'));
      onClose();
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert(t('common.error'), t('profile.updateError'));
    } finally {
      setIsLoading(false);
    }
  };

  const addSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }));
      setNewSkill('');
    }
  };

  const removeSkill = (index: number) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index)
    }));
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>{t('profile.editProfile')}</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <X size={24} color="#000" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.avatarSection}>
            <View style={styles.avatarContainer}>
              <Image 
                source={{ 
                  uri: formData.avatar || 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400' 
                }}
                style={styles.avatarImage}
              />
              <TouchableOpacity 
                style={styles.cameraButton}
                onPress={pickImage}
                disabled={uploadingImage}
              >
                {uploadingImage ? (
                  <ActivityIndicator size="small" color="#000" />
                ) : (
                  <Camera size={20} color="#000" />
                )}
              </TouchableOpacity>
            </View>
            <Text style={styles.avatarLabel}>{t('profile.changePhoto')}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>{t('profile.name')} *</Text>
            <TextInput
              style={styles.input}
              value={formData.name}
              onChangeText={(text) => setFormData(prev => ({ ...prev, name: text }))}
              placeholder={t('profile.namePlaceholder')}
              placeholderTextColor="#999"
            />
          </View>

          {userType === 'fixer' && (
            <View style={styles.section}>
              <Text style={styles.label}>{t('profile.profession')} *</Text>
              <TextInput
                style={styles.input}
                value={formData.profession}
                onChangeText={(text) => setFormData(prev => ({ ...prev, profession: text }))}
                placeholder={t('profile.professionPlaceholder')}
                placeholderTextColor="#999"
              />
            </View>
          )}

          <View style={styles.section}>
            <Text style={styles.label}>{t('profile.email')} *</Text>
            <TextInput
              style={styles.input}
              value={formData.email}
              onChangeText={(text) => setFormData(prev => ({ ...prev, email: text }))}
              placeholder={t('profile.emailPlaceholder')}
              placeholderTextColor="#999"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>{t('profile.phone')} *</Text>
            <TextInput
              style={styles.input}
              value={formData.phone}
              onChangeText={(text) => setFormData(prev => ({ ...prev, phone: text }))}
              placeholder={t('profile.phonePlaceholder')}
              placeholderTextColor="#999"
              keyboardType="phone-pad"
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>{t('profile.location')} *</Text>
            <TextInput
              style={styles.input}
              value={formData.location}
              onChangeText={(text) => setFormData(prev => ({ ...prev, location: text }))}
              placeholder={t('profile.locationPlaceholder')}
              placeholderTextColor="#999"
            />
          </View>

          {userType === 'fixer' && (
            <>
              <View style={styles.section}>
                <Text style={styles.label}>{t('profile.about')}</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={formData.about}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, about: text }))}
                  placeholder={t('profile.aboutPlaceholder')}
                  placeholderTextColor="#999"
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                />
              </View>

              <View style={styles.section}>
                <Text style={styles.label}>{t('profile.skills')}</Text>
                
                <View style={styles.skillInputContainer}>
                  <TextInput
                    style={[styles.input, styles.skillInput]}
                    value={newSkill}
                    onChangeText={setNewSkill}
                    placeholder={t('profile.skillPlaceholder')}
                    placeholderTextColor="#999"
                    onSubmitEditing={addSkill}
                  />
                  <TouchableOpacity onPress={addSkill} style={styles.addButton}>
                    <Plus size={20} color="#000" />
                  </TouchableOpacity>
                </View>

                <View style={styles.skillsContainer}>
                  {formData.skills.map((skill, index) => (
                    <View key={index} style={styles.skillChip}>
                      <Text style={styles.skillText}>{skill}</Text>
                      <TouchableOpacity
                        onPress={() => removeSkill(index)}
                        style={styles.removeSkillButton}
                      >
                        <Minus size={16} color="#000" />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              </View>
            </>
          )}
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.saveButton, isLoading && styles.saveButtonDisabled]}
            onPress={handleSave}
            disabled={isLoading}
          >
            <Text style={styles.saveButtonText}>
              {isLoading ? t('common.loading') : t('profile.saveChanges')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  closeButton: {
    padding: 4,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#000',
  },
  textArea: {
    height: 100,
    paddingTop: 12,
  },
  skillInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  skillInput: {
    flex: 1,
  },
  addButton: {
    backgroundColor: '#FFD700',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  skillChip: {
    backgroundColor: '#FFD700',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  skillText: {
    fontSize: 14,
    color: '#000',
  },
  removeSkillButton: {
    padding: 2,
  },
  footer: {
    padding: 20,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  saveButton: {
    backgroundColor: '#FFD700',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatarImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#e0e0e0',
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#FFD700',
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#fff',
  },
  avatarLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 12,
  },
});