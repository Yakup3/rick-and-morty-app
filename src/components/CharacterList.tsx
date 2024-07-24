import React, {useEffect, useState} from 'react';
import {
  Text,
  View,
  Image,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';

import colors from '../theme/colors';
import {STATUS} from '../shared/constants';
import {fetchCharacters} from '../services/api';
import {Character, Info} from '../services/models';

interface CharacterListProps {
  handleOnFilterIcon: () => void;
}

const CharacterList: React.FC<CharacterListProps> = ({handleOnFilterIcon}) => {
  const [info, setInfo] = useState<Info>();
  const [loading, setLoading] = useState<boolean>(true);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [page, setPage] = useState<number>(1);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);

  useEffect(() => {
    _fetchCharacters(page);
  }, [page]);

  const _fetchCharacters = async (page: number) => {
    if (page === 1) {
      setLoading(true);
    } else {
      setIsLoadingMore(true);
    }

    const data = await fetchCharacters(page);

    setInfo(data.info);
    setCharacters(prevCharacters =>
      page === 1 ? data.results : [...prevCharacters, ...data.results],
    );
    setLoading(false);
    setIsLoadingMore(false);
  };

  const handleLoadMoreCharacters = () => {
    if (info?.next) {
      setPage(prevPage => prevPage + 1);
    }
  };

  const getStatusColor = (status: string) => {
    return status === STATUS[0].title
      ? colors.green
      : status === STATUS[0].title
      ? colors.red
      : colors.gray.medium;
  };

  const renderCharacterItem = ({item}: {item: Character}) => (
    <View style={{...styles.item, borderColor: getStatusColor(item.status)}}>
      <View style={styles.characterImageContainer}>
        <Image source={{uri: item.image}} style={styles.characterImage} />
        <View
          style={{
            ...styles.characterStatusContainer,
            backgroundColor: getStatusColor(item.status),
          }}>
          <Text style={styles.characterStatusText}>{item.status}</Text>
        </View>
      </View>
      <View style={styles.characterInfoContainer}>
        <Text
          style={styles.characterName}
          numberOfLines={1}
          ellipsizeMode="tail">
          {item.name}
        </Text>
        <View>
          <Text style={styles.locationLabel}>Last known location:</Text>
          <Text style={styles.characterLocation}>{item.location.name}</Text>
        </View>
      </View>
    </View>
  );

  const renderHeader = () => {
    return (
      <View style={styles.headerContainer}>
        <Text style={styles.totalCharacterCount}>
          Total Characters: {characters.length} / {info?.count}
        </Text>
        <AntDesign
          onPress={handleOnFilterIcon}
          name="filter"
          size={24}
          color={colors.text.black}
        />
      </View>
    );
  };

  const renderCharacterList = () => {
    return (
      <FlatList
        key={2}
        numColumns={2}
        data={characters}
        renderItem={renderCharacterItem}
        showsVerticalScrollIndicator={false}
        keyExtractor={item => item.id.toString()}
        onEndReached={handleLoadMoreCharacters}
        onEndReachedThreshold={0.1}
        ListFooterComponent={() =>
          isLoadingMore && (
            <ActivityIndicator animating={true} color={colors.gray.medium} />
          )
        }
      />
    );
  };

  if (loading && page === 1) {
    return <ActivityIndicator size="large" color={colors.gray.medium} />;
  }

  return (
    <View style={styles.container}>
      {renderHeader()}
      {renderCharacterList()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 10,
    paddingRight: 10,
    marginBottom: 20,
  },
  totalCharacterCount: {
    fontSize: 20,
    fontWeight: '400',
  },
  item: {
    flex: 1 / 2,
    height: 300,
    margin: 8,
    borderRadius: 15,
    flexDirection: 'column',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#178F51',
    backgroundColor: colors.gray.lighter,
  },
  characterImageContainer: {
    width: '100%',
    height: '60%',
  },
  characterImage: {
    width: '100%',
    height: '100%',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  characterStatusContainer: {
    top: 10,
    left: 10,
    borderRadius: 5,
    paddingVertical: 2,
    paddingHorizontal: 5,
    position: 'absolute',
    backgroundColor: colors.green,
  },
  characterStatusText: {
    fontWeight: 'bold',
    color: colors.text.white,
  },
  characterInfoContainer: {
    display: 'flex',
    height: '40%',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    justifyContent: 'space-evenly',
  },
  characterName: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  locationLabel: {
    fontSize: 14,
    color: colors.gray.light,
    marginBottom: 3,
  },
  characterLocation: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.gray.medium,
  },
});

export default CharacterList;
