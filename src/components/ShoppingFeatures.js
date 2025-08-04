import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const ShoppingFeatures = ({ userId }) => {
  const [products, setProducts] = useState([]);
  const [collections, setCollections] = useState([]);
  const [shoppingStories, setShoppingStories] = useState([]);
  const [savedItems, setSavedItems] = useState([]);
  const [isShopEnabled, setIsShopEnabled] = useState(false);

  const fetchShoppingData = async () => {
    // Mock shopping data - replace with Firebase queries
    const mockData = {
      products: [
        {
          id: 1,
          name: 'Vintage Denim Jacket',
          price: 89.99,
          image: 'https://example.com/jacket.jpg',
          description: 'Classic vintage denim jacket',
          sizes: ['S', 'M', 'L', 'XL'],
          colors: ['Blue', 'Black'],
          tags: ['vintage', 'denim', 'jacket'],
          inStock: true,
          shopLink: 'https://shop.example.com/product/1',
        },
        {
          id: 2,
          name: 'Minimalist Watch',
          price: 199.99,
          image: 'https://example.com/watch.jpg',
          description: 'Elegant minimalist timepiece',
          sizes: ['One Size'],
          colors: ['Silver', 'Gold', 'Rose Gold'],
          tags: ['watch', 'minimalist', 'accessories'],
          inStock: true,
          shopLink: 'https://shop.example.com/product/2',
        },
      ],
      collections: [
        {
          id: 1,
          name: 'Summer Essentials',
          items: [1, 2],
          image: 'https://example.com/collection1.jpg',
        },
        {
          id: 2,
          name: 'Street Style',
          items: [1],
          image: 'https://example.com/collection2.jpg',
        },
      ],
      shoppingStories: [
        {
          id: 1,
          title: 'New Arrivals',
          products: [1, 2],
          storyImage: 'https://example.com/story1.jpg',
          swipeUpLink: 'https://shop.example.com/new-arrivals',
        },
      ],
      savedItems: [1],
    };

    setProducts(mockData.products);
    setCollections(mockData.collections);
    setShoppingStories(mockData.shoppingStories);
    setSavedItems(mockData.savedItems);
  };

  const ProductCard = ({ product }) => (
    <View style={styles.productCard}>
      <Image source={{ uri: product.image }} style={styles.productImage} />
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{product.name}</Text>
        <Text style={styles.productPrice}>${product.price}</Text>
        <Text style={styles.productDescription}>{product.description}</Text>
        
        <View style={styles.productTags}>
          {product.tags.map(tag => (
            <Text key={tag} style={styles.tag}>#{tag}</Text>
          ))}
        </View>

        <View style={styles.productActions}>
          <TouchableOpacity style={styles.shopButton}>
            <Text style={styles.shopButtonText}>Shop Now</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.saveButton}>
            <Ionicons name="bookmark-outline" size={20} color="#5865f2" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const CollectionCard = ({ collection }) => (
    <TouchableOpacity style={styles.collectionCard}>
      <Image source={{ uri: collection.image }} style={styles.collectionImage} />
      <Text style={styles.collectionName}>{collection.name}</Text>
      <Text style={styles.collectionCount}>{collection.items.length} items</Text>
    </TouchableOpacity>
  );

  const ShoppingStoryCard = ({ story }) => (
    <TouchableOpacity style={styles.storyCard}>
      <Image source={{ uri: story.storyImage }} style={styles.storyImage} />
      <Text style={styles.storyTitle}>{story.title}</Text>
      <Text style={styles.storyProducts}>{story.products.length} products</Text>
      <TouchableOpacity style={styles.swipeUpButton}>
        <Text style={styles.swipeUpText}>Swipe Up to Shop</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const ProductTagger = ({ onProductTagged }) => {
    const [taggedProducts, setTaggedProducts] = useState([]);
    
    const handleProductTag = (product, position) => {
      setTaggedProducts(prev => [...prev, { product, position }]);
      onProductTagged(product, position);
    };

    return (
      <View style={styles.taggerContainer}>
        <Text style={styles.taggerTitle}>Tag Products</Text>
        <ScrollView horizontal>
          {products.map(product => (
            <TouchableOpacity
              key={product.id}
              style={styles.tagProductButton}
              onPress={() => handleProductTag(product, { x: 0.5, y: 0.5 })}
            >
              <Image source={{ uri: product.image }} style={styles.tagProductImage} />
              <Text style={styles.tagProductName}>{product.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    );
  };

  const Wishlist = () => (
    <View style={styles.wishlistContainer}>
      <Text style={styles.wishlistTitle}>Saved Items</Text>
      <ScrollView>
        {savedItems.map(itemId => {
          const item = products.find(p => p.id === itemId);
          return item ? (
            <View key={item.id} style={styles.wishlistItem}>
              <Image source={{ uri: item.image }} style={styles.wishlistImage} />
              <View style={styles.wishlistInfo}>
                <Text style={styles.wishlistName}>{item.name}</Text>
                <Text style={styles.wishlistPrice}>${item.price}</Text>
              </View>
              <TouchableOpacity style={styles.removeButton}>
                <Ionicons name="trash-outline" size={20} color="#ff4757" />
              </TouchableOpacity>
            </View>
          ) : null;
        })}
      </ScrollView>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Shopping</Text>
        <TouchableOpacity 
          style={styles.shopToggle}
          onPress={() => setIsShopEnabled(!isShopEnabled)}
        >
          <Text style={styles.toggleText}>
            {isShopEnabled ? 'Shop Enabled' : 'Enable Shop'}
          </Text>
        </TouchableOpacity>
      </View>

      {isShopEnabled && (
        <>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Products</Text>
            <ScrollView horizontal>
              {products.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </ScrollView>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Collections</Text>
            <ScrollView horizontal>
              {collections.map(collection => (
                <CollectionCard key={collection.id} collection={collection} />
              ))}
            </ScrollView>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Shopping Stories</Text>
            <ScrollView horizontal>
              {shoppingStories.map(story => (
                <ShoppingStoryCard key={story.id} story={story} />
              ))}
            </ScrollView>
          </View>

          <Wishlist />
        </>
      )}

      <ProductTagger onProductTagged={(product, position) => {
        console.log('Product tagged:', product, 'at position:', position);
      }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  shopToggle: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#5865f2',
  },
  toggleText: {
    color: 'white',
    fontSize: 14,
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  productCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    marginRight: 15,
    width: 200,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  productImage: {
    width: 200,
    height: 200,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  productInfo: {
    padding: 15,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  productPrice: {
    fontSize: 18,
    color: '#5865f2',
    fontWeight: 'bold',
  },
  productDescription: {
    fontSize: 12,
    color: '#666',
    marginBottom: 10,
  },
  productTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  tag: {
    fontSize: 12,
    color: '#5865f2',
    marginRight: 5,
  },
  productActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  shopButton: {
    backgroundColor: '#5865f2',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  shopButtonText: {
    color: 'white',
    fontSize: 12,
  },
  saveButton: {
    padding: 8,
  },
  collectionCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    marginRight: 15,
    width: 150,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  collectionImage: {
    width: 150,
    height: 150,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  collectionName: {
    fontSize: 14,
    fontWeight: 'bold',
    padding: 10,
  },
  collectionCount: {
    fontSize: 12,
    color: '#666',
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
  storyCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    marginRight: 15,
    width: 120,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  storyImage: {
    width: 120,
    height: 120,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  storyTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    padding: 10,
  },
  storyProducts: {
    fontSize: 10,
    color: '#666',
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
  swipeUpButton: {
    backgroundColor: '#5865f2',
    padding: 8,
    margin: 10,
    borderRadius: 15,
  },
  swipeUpText: {
    color: 'white',
    fontSize: 10,
    textAlign: 'center',
  },
  wishlistContainer: {
    padding: 20,
  },
  wishlistTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  wishlistItem: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 10,
    marginBottom: 10,
    padding: 10,
    alignItems: 'center',
  },
  wishlistImage: {
    width: 60,
    height: 60,
    borderRadius: 10,
    marginRight: 10,
  },
  wishlistInfo: {
    flex: 1,
  },
  wishlistName: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  wishlistPrice: {
    fontSize: 14,
    color: '#5865f2',
  },
  removeButton: {
    padding: 5,
  },
  taggerContainer: {
    padding: 20,
    backgroundColor: 'white',
    margin: 20,
    borderRadius: 10,
  },
  taggerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  tagProductButton: {
    marginRight: 10,
    alignItems: 'center',
  },
  tagProductImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  tagProductName: {
    fontSize: 12,
    marginTop: 5,
  },
});

export default ShoppingFeatures;
