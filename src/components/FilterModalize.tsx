import React, {RefObject, useCallback, useMemo, useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Modalize} from 'react-native-modalize';
import AntDesign from 'react-native-vector-icons/AntDesign';

import colors from '../theme/colors';
import {List} from 'react-native-paper';
import {STATUS} from '../shared/constants';
import {Location, Status} from '../services/models';

interface FilterModalizeProps {
  locations: Location[];
  modalizeRef: RefObject<Modalize>;
  handleOnClose: () => void;
  handleOnFilter: (
    selectedStatus: Status | undefined,
    selectedLocation: Location | undefined,
  ) => void;
}

const FilterModalize: React.FC<FilterModalizeProps> = ({
  locations,
  modalizeRef,
  handleOnClose,
  handleOnFilter,
}) => {
  const [selectedStatus, setSelectedStatus] = useState<Status | undefined>();
  const [selectedLocation, setSelectedLocation] = useState<
    Location | undefined
  >();

  const handleOnClear = useCallback(() => {
    setSelectedStatus(undefined);
    setSelectedLocation(undefined);
  }, []);

  const handleOnApply = useCallback(() => {
    handleOnFilter(selectedStatus, selectedLocation);
    handleOnClose();
  }, [handleOnFilter, handleOnClose, selectedStatus, selectedLocation]);

  const renderHeader = useMemo(() => {
    return (
      <View style={styles.header}>
        <View style={styles.headerLeftContainer}>
          <AntDesign
            onPress={handleOnClose}
            name="close"
            size={24}
            color={colors.gray.medium}
          />
          <Text style={styles.headerText}>Filter</Text>
        </View>
        <View style={styles.headerRightContainer}>
          <TouchableOpacity onPress={handleOnClear}>
            <Text style={{...styles.headerText, color: colors.orange}}>
              Clear
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleOnApply}>
            <Text style={{...styles.headerText, color: colors.green}}>
              Apply
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }, [handleOnClose, handleOnClear, handleOnApply]);

  const renderStatusItem = useCallback(
    (item: Status) => {
      return (
        <TouchableOpacity
          style={styles.accordionItemContainer}
          key={item.value}
          onPress={() => setSelectedStatus(item)}>
          <List.Item title={item.title} />
          {selectedStatus?.value === item.value && (
            <AntDesign name="check" size={24} color={colors.gray.medium} />
          )}
        </TouchableOpacity>
      );
    },
    [selectedStatus],
  );

  const renderLocationsItem = useCallback(
    (item: Location) => {
      return (
        <TouchableOpacity
          style={styles.accordionItemContainer}
          key={item.id}
          onPress={() => setSelectedLocation(item)}>
          <List.Item title={item.name} />
          {selectedLocation?.url === item.url && (
            <AntDesign name="check" size={24} color={colors.gray.medium} />
          )}
        </TouchableOpacity>
      );
    },
    [selectedLocation],
  );

  const renderBody = useMemo(() => {
    return (
      <View>
        <List.Accordion
          titleStyle={styles.accordionTitle}
          title="Status"
          description={selectedStatus?.title}>
          {STATUS.map(renderStatusItem)}
        </List.Accordion>
        <List.Accordion
          titleStyle={styles.accordionTitle}
          title="Location"
          description={selectedLocation?.name}>
          {locations.map(renderLocationsItem)}
        </List.Accordion>
      </View>
    );
  }, [
    renderStatusItem,
    renderLocationsItem,
    selectedStatus,
    selectedLocation,
    locations,
  ]);

  return (
    <Modalize modalStyle={styles.modalStyle} ref={modalizeRef}>
      {renderHeader}
      {renderBody}
    </Modalize>
  );
};

const styles = StyleSheet.create({
  modalStyle: {
    flex: 1,
    padding: 10,
    borderRadius: 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeftContainer: {
    gap: 30,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerRightContainer: {
    gap: 30,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 22,
    fontWeight: '600',
  },
  accordionItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingRight: 10,
  },
  accordionTitle: {
    fontSize: 18,
    fontWeight: '500',
  },
});

export default FilterModalize;
