// SafeSpace - Enhanced Anonymous Support Community
// Modern JavaScript with ES6+ features and improved UX

// Global variables and state management
const AppState = {
    currentPage: 1,
    currentRoomId: null,
    messagePollingInterval: null,
    posts: [],
    chatRooms: [],
    isLoggedIn: false,
    currentUser: null,
    isLoading: false
};

// DOM Elements cache
const DOM = {
    loadingScreen: null,
    safetyNotice: null,
    appContainer: null,
    welcomeSection: null,
    communitySection: null,
    postsFeed: null,
    roomsGrid: null,
    messagesContainer: null,
    messageToast: null
};

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// Main initialization function
function initializeApp() {
    // Cache DOM elements
    cacheDOMElements();
    
    // Show loading screen
    showLoadingScreen();
    
    // Initialize after a short delay for smooth UX
    setTimeout(() => {
        setupEventListeners();
        checkAuthenticationStatus();
        hideLoadingScreen();
        
        // Temporarily disable safety notice for testing
        // if (!localStorage.getItem('safespace-notice-seen')) {
        //     showSafetyNotice();
        // } else {
        //     // If safety notice has been seen, ensure the welcome section is visible
        //     if (DOM.welcomeSection) {
        //         DOM.welcomeSection.style.display = 'block';
        //     }
        // }
        
        // Force show welcome section
        if (DOM.welcomeSection) {
            DOM.welcomeSection.style.display = 'block';
            console.log('Welcome section should be visible now');
        }
        if (DOM.safetyNotice) {
            DOM.safetyNotice.style.display = 'none';
            console.log('Safety notice hidden');
        }
        
        // Debug: Check if buttons exist
        const enterButtons = document.querySelectorAll('.enter-btn');
        console.log('Found enter buttons:', enterButtons.length);
        enterButtons.forEach((btn, index) => {
            console.log(`Button ${index}:`, btn.textContent.trim());
        });
    }, 1000);
}

// Cache frequently used DOM elements
function cacheDOMElements() {
    DOM.loadingScreen = document.getElementById('loading-screen');
    DOM.safetyNotice = document.getElementById('safety-notice');
    DOM.appContainer = document.getElementById('app-container');
    DOM.welcomeSection = document.getElementById('welcome-section');
    DOM.communitySection = document.getElementById('community-section');
    DOM.postsFeed = document.getElementById('posts-feed');
    DOM.roomsGrid = document.getElementById('rooms-grid');
    DOM.messagesContainer = document.getElementById('messages-container');
    DOM.messageToast = document.getElementById('message-toast');
}

// Set up all event listeners
function setupEventListeners() {
    // Navigation tabs
    setupTabNavigation();
    
    // Form submissions
    setupFormSubmissions();
    
    // Character counter for post content
    setupCharacterCounter();
    
    // Auto-resize textareas
    setupAutoResize();
    
    // Emergency exit keyboard shortcut (Alt + X)
    document.addEventListener('keydown', handleKeyboardShortcuts);
    
    // Click outside modals to close
    document.addEventListener('click', handleOutsideClicks);
}

// Setup tab navigation
function setupTabNavigation() {
    const navTabs = document.querySelectorAll('.nav-tab');
    navTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetTab = tab.dataset.tab;
            switchTab(targetTab);
        });
    });
}

// Setup form submissions
function setupFormSubmissions() {
    // Post form
    const postForm = document.getElementById('post-form');
    if (postForm) {
        postForm.addEventListener('submit', handlePostSubmission);
    }
    
    // Message form
    const messageForm = document.getElementById('message-form');
    if (messageForm) {
        messageForm.addEventListener('submit', handleMessageSubmission);
    }
    
    // Report form
    const reportForm = document.getElementById('report-form');
    if (reportForm) {
        reportForm.addEventListener('submit', handleReportSubmission);
    }
}

// Setup character counter
function setupCharacterCounter() {
    const postContent = document.getElementById('post-content');
    const charCount = document.getElementById('char-count');
    
    if (postContent && charCount) {
        postContent.addEventListener('input', () => {
            const count = postContent.value.length;
            charCount.textContent = count;
            
            // Add visual feedback
            if (count > 1000) {
                charCount.style.color = '#ef4444';
            } else if (count > 500) {
                charCount.style.color = '#f59e0b';
            } else {
                charCount.style.color = '#6b7280';
            }
        });
    }
}

// Setup auto-resize for textareas
function setupAutoResize() {
    const textareas = document.querySelectorAll('textarea');
    textareas.forEach(textarea => {
        textarea.addEventListener('input', () => {
            textarea.style.height = 'auto';
            textarea.style.height = textarea.scrollHeight + 'px';
        });
    });
}

// Handle keyboard shortcuts
function handleKeyboardShortcuts(e) {
    // Emergency exit (Alt + X)
    if (e.altKey && e.key === 'x') {
        e.preventDefault();
        emergencyExit();
    }
    
    // Escape key to close modals and safety notice
    if (e.key === 'Escape') {
        closeAllModals();
        closeSafetyNotice();
    }
    
    // Enter key to close safety notice
    if (e.key === 'Enter' && DOM.safetyNotice && DOM.safetyNotice.style.display === 'flex') {
        closeSafetyNotice();
    }
}

// Handle clicks outside modals
function handleOutsideClicks(e) {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        if (e.target === modal) {
            closeModal(modal.id);
        }
    });
}

// Loading screen functions
function showLoadingScreen() {
    if (DOM.loadingScreen) {
        DOM.loadingScreen.style.display = 'flex';
    }
}

function hideLoadingScreen() {
    if (DOM.loadingScreen) {
        DOM.loadingScreen.classList.add('hidden');
        setTimeout(() => {
            DOM.loadingScreen.style.display = 'none';
        }, 500);
    }
}

// Safety notice functions
function showSafetyNotice() {
    if (DOM.safetyNotice) {
        DOM.safetyNotice.style.display = 'flex';
    }
}

function closeSafetyNotice() {
    if (DOM.safetyNotice) {
        DOM.safetyNotice.style.display = 'none';
        localStorage.setItem('safespace-notice-seen', 'true');
    }
}

// Check authentication status
function checkAuthenticationStatus() {
    // For demo purposes, we'll simulate a logged-in state
    // In a real app, this would check for valid session tokens
    AppState.isLoggedIn = true;
    AppState.currentUser = {
        anonymousId: 'Anonymous_' + Math.random().toString(36).substr(2, 8),
        displayName: null
    };
    
    updateUIForAuthentication();
}

// Update UI based on authentication status
function updateUIForAuthentication() {
    if (AppState.isLoggedIn) {
        showUserInfo();
        loadInitialContent();
    } else {
        showWelcomeSection();
    }
}

// Show user information
function showUserInfo() {
    const userInfo = document.getElementById('user-info');
    const anonymousId = document.getElementById('anonymous-id');
    
    if (userInfo && anonymousId && AppState.currentUser) {
        anonymousId.textContent = AppState.currentUser.anonymousId;
        userInfo.style.display = 'flex';
    }
}

// Load initial content for logged-in users
function loadInitialContent() {
    loadPosts();
    loadChatRooms();
    loadSupportResources();
}

// Switch between tabs
function switchTab(tabName) {
    // Update tab buttons
    const navTabs = document.querySelectorAll('.nav-tab');
    navTabs.forEach(tab => {
        tab.classList.remove('active');
        if (tab.dataset.tab === tabName) {
            tab.classList.add('active');
        }
    });
    
    // Update tab content
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(content => {
        content.classList.remove('active');
        if (content.id === `${tabName}-tab`) {
            content.classList.add('active');
        }
    });
    
    // Load specific content based on tab
    switch (tabName) {
        case 'posts':
            if (AppState.posts.length === 0) {
                loadPosts();
            }
            break;
        case 'chat':
            if (AppState.chatRooms.length === 0) {
                loadChatRooms();
            }
            break;
        case 'resources':
            loadSupportResources();
            break;
    }
}

// Show welcome section
function showWelcomeSection() {
    if (DOM.welcomeSection) {
        DOM.welcomeSection.style.display = 'block';
    }
    if (DOM.communitySection) {
        DOM.communitySection.style.display = 'none';
    }
}

// Enter community
function enterCommunity() {
    if (DOM.welcomeSection) {
        DOM.welcomeSection.style.display = 'none';
    }
    if (DOM.communitySection) {
        DOM.communitySection.style.display = 'block';
    }
    
    // Load initial content
    loadInitialContent();
}

// Load posts
async function loadPosts(page = 1, append = false) {
    if (AppState.isLoading) return;
    
    AppState.isLoading = true;
    showLoadingState('posts');
    
    try {
        // Simulate API call
        await simulateAPICall(1000);
        
        // Generate demo posts
        const demoPosts = generateDemoPosts(page);
        
        if (append) {
            AppState.posts = AppState.posts.concat(demoPosts);
        } else {
            AppState.posts = demoPosts;
        }
        
        displayPosts();
        hideLoadingState('posts');
        
        // Show load more button if there are more posts
        if (page < 3) {
            showLoadMoreButton();
        }
        
    } catch (error) {
        console.error('Load posts error:', error);
        showErrorMessage('Failed to load posts');
        hideLoadingState('posts');
    } finally {
        AppState.isLoading = false;
    }
}

// Generate demo posts for demonstration
function generateDemoPosts(page) {
    const postTypes = ['support', 'share', 'advice', 'healing', 'resources'];
    const titles = [
        'Feeling lost and need support',
        'My journey to healing - 6 months later',
        'Advice on rebuilding trust',
        'Therapy resources that changed my life',
        'Having a really hard day today'
    ];
    
    const contents = [
        'I\'ve been feeling really lost lately. The trauma from what happened is affecting my daily life and I don\'t know how to move forward. Has anyone else felt this way?',
        'It\'s been 6 months since I started my healing journey. I wanted to share that it does get better, even though some days are still really hard. Therapy has been a lifesaver.',
        'I\'m trying to rebuild trust in relationships after what happened. Does anyone have advice on how to start trusting people again? I feel like I\'m always waiting for the other shoe to drop.',
        'I found this amazing therapist who specializes in trauma. She\'s helped me so much with EMDR therapy. If anyone is looking for resources, I can share more details.',
        'Today has been one of those days where everything feels heavy. The flashbacks are really bad and I just needed to reach out to people who understand what this feels like.'
    ];
    
            const posts = [];
        const realisticNames = [
            'Sarah', 'Emma', 'Jessica', 'Ashley', 'Amanda', 'Nicole', 'Rachel', 'Megan', 
            'Lauren', 'Stephanie', 'Rebecca', 'Michelle', 'Kimberly', 'Elizabeth', 'Amber',
            'Melissa', 'Danielle', 'Brittany', 'Jennifer', 'Heather', 'Tiffany', 'Crystal',
            'Katherine', 'Christina', 'Vanessa', 'Samantha', 'Natalie', 'Hannah', 'Alexis',
            'Courtney', 'Victoria', 'Jasmine', 'Alyssa', 'Kayla', 'Madison', 'Morgan'
        ];
        
        for (let i = 0; i < 5; i++) {
            const postId = (page - 1) * 5 + i + 1;
            const randomName = realisticNames[Math.floor(Math.random() * realisticNames.length)];
            posts.push({
                id: postId,
                title: titles[i],
                content: contents[i],
                post_type: postTypes[i],
                anonymous_id: randomName + '_' + Math.random().toString(36).substr(2, 4),
                created_at: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
                likes_count: Math.floor(Math.random() * 15) + 2,
                comments_count: Math.floor(Math.random() * 8) + 1,
                is_anonymous: true
            });
        }
    
    return posts;
}

// Display posts
function displayPosts() {
    if (!DOM.postsFeed) return;
    
    DOM.postsFeed.innerHTML = '';
    
    if (AppState.posts.length === 0) {
        DOM.postsFeed.innerHTML = `
            <div class="no-posts">
                <i class="fas fa-comments"></i>
                <h3>No posts yet</h3>
                <p>Be the first to share your story and support others</p>
                <button class="new-post-btn" onclick="showNewPostForm()">
                    <i class="fas fa-plus"></i> Share Your Story
                </button>
            </div>
        `;
        return;
    }
    
    AppState.posts.forEach(post => {
        const postElement = createPostElement(post);
        DOM.postsFeed.appendChild(postElement);
    });
}

// Create post element
function createPostElement(post) {
    const postDiv = document.createElement('div');
    postDiv.className = 'post';
    
    const timeAgo = getTimeAgo(post.created_at);
    const typeLabel = getTypeLabel(post.post_type);
    const authorName = post.is_anonymous ? post.anonymous_id : (post.display_name || post.anonymous_id);
    
    postDiv.innerHTML = `
        <div class="post-header">
            <div class="post-title">${escapeHtml(post.title || 'Anonymous Post')}</div>
            <div class="post-type">${typeLabel}</div>
        </div>
        <div class="post-content">${escapeHtml(post.content)}</div>
        <div class="post-footer">
            <div class="post-meta">
                <span class="post-author">${escapeHtml(authorName)}</span>
                <span class="post-time">${timeAgo}</span>
            </div>
            <div class="post-actions">
                <button class="action-btn ${post.liked ? 'liked' : ''}" onclick="toggleLike(${post.id})">
                    <i class="fas fa-heart"></i> ${post.likes_count || 0}
                </button>
                <button class="action-btn" onclick="showComments(${post.id})">
                    <i class="fas fa-comment"></i> ${post.comments_count || 0}
                </button>
                <button class="action-btn" onclick="showReportModal('post', ${post.id})">
                    <i class="fas fa-flag"></i> Report
                </button>
            </div>
        </div>
        <div class="comments-section" id="comments-${post.id}" style="display: none;">
            <div class="comments-container"></div>
            <div class="comment-form">
                <textarea placeholder="Add a supportive comment..." rows="2"></textarea>
                <button onclick="addComment(${post.id})">
                    <i class="fas fa-paper-plane"></i> Comment
                </button>
            </div>
        </div>
    `;
    
    return postDiv;
}

// Handle post submission
async function handlePostSubmission(e) {
    e.preventDefault();
    
    const title = document.getElementById('post-title').value.trim();
    const content = document.getElementById('post-content').value.trim();
    const postType = document.getElementById('post-type').value;
    
    if (!content) {
        showErrorMessage('Please enter a message');
        return;
    }
    
    if (content.length > 2000) {
        showErrorMessage('Message is too long. Please keep it under 2000 characters.');
        return;
    }
    
    try {
        // Simulate API call
        await simulateAPICall(1500);
        
        // Create new post
        const newPost = {
            id: Date.now(),
            title: title || null,
            content: content,
            post_type: postType,
            anonymous_id: AppState.currentUser.anonymousId,
            created_at: new Date().toISOString(),
            likes_count: 0,
            comments_count: 0,
            is_anonymous: true
        };
        
        // Add to beginning of posts array
        AppState.posts.unshift(newPost);
        displayPosts();
        
        // Hide form and show success message
        hideNewPostForm();
        showSuccessMessage('Your post has been shared anonymously');
        
        // Reset form
        document.getElementById('post-form').reset();
        document.getElementById('char-count').textContent = '0';
        
    } catch (error) {
        console.error('Post submission error:', error);
        showErrorMessage('Failed to share your post. Please try again.');
    }
}

// Toggle like on post
async function toggleLike(postId) {
    try {
        // Simulate API call
        await simulateAPICall(500);
        
        const post = AppState.posts.find(p => p.id === postId);
        if (post) {
            if (post.liked) {
                post.likes_count--;
                post.liked = false;
            } else {
                post.likes_count++;
                post.liked = true;
            }
            displayPosts();
        }
    } catch (error) {
        console.error('Toggle like error:', error);
        showErrorMessage('Failed to update like');
    }
}

// Show comments for a post
function showComments(postId) {
    const commentsSection = document.getElementById(`comments-${postId}`);
    if (commentsSection) {
        const isVisible = commentsSection.style.display !== 'none';
        commentsSection.style.display = isVisible ? 'none' : 'block';
        
        if (!isVisible) {
            loadComments(postId);
        }
    }
}

// Load comments for a post
async function loadComments(postId) {
    try {
        // Simulate API call
        await simulateAPICall(800);
        
        // Generate demo comments
        const comments = generateDemoComments(postId);
        displayComments(postId, comments);
        
    } catch (error) {
        console.error('Load comments error:', error);
        showErrorMessage('Failed to load comments');
    }
}

// Generate demo comments
function generateDemoComments(postId) {
    const commentTexts = [
        'You\'re not alone. I felt exactly the same way for months after my experience. It does get better, even though it doesn\'t feel like it right now.',
        'Thank you for being brave enough to share this. Your story helps others feel less alone. You\'re doing amazing.',
        'I\'m so sorry you\'re going through this. I\'ve been there and I know how overwhelming it can feel. You\'re stronger than you know.',
        'This community is here for you. We believe you and we support you. You don\'t have to go through this alone.',
        'Sending you so much love and strength. The healing journey isn\'t linear, but you\'re making progress even on the hard days.',
        'I found that journaling really helped me process my feelings. Maybe that could help you too?',
        'You\'re not broken. What happened to you doesn\'t define you. You\'re still the same amazing person.',
        'Have you considered therapy? I found a trauma specialist who really helped me work through everything.',
        'I\'m here if you need to talk. Sometimes just having someone listen makes all the difference.',
        'You\'re doing the right thing by reaching out. That takes courage and strength.'
    ];
    
    const realisticNames = [
        'Maria', 'Sophia', 'Isabella', 'Olivia', 'Ava', 'Mia', 'Charlotte', 'Amelia',
        'Harper', 'Evelyn', 'Abigail', 'Emily', 'Sofia', 'Avery', 'Ella', 'Madison',
        'Scarlett', 'Victoria', 'Aria', 'Grace', 'Chloe', 'Camila', 'Penelope', 'Layla',
        'Riley', 'Zoey', 'Nora', 'Lily', 'Eleanor', 'Hannah', 'Luna', 'Savannah'
    ];
    
    return commentTexts.map((text, index) => {
        const randomName = realisticNames[Math.floor(Math.random() * realisticNames.length)];
        return {
            id: Date.now() + index,
            content: text,
            anonymous_id: randomName + '_' + Math.random().toString(36).substr(2, 4),
            created_at: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString(),
            is_anonymous: true
        };
    });
}

// Display comments
function displayComments(postId, comments) {
    const commentsContainer = document.querySelector(`#comments-${postId} .comments-container`);
    if (!commentsContainer) return;
    
    commentsContainer.innerHTML = '';
    
    if (comments.length === 0) {
        commentsContainer.innerHTML = '<div class="no-comments">No comments yet. Be the first to show support!</div>';
        return;
    }
    
    comments.forEach(comment => {
        const commentElement = createCommentElement(comment);
        commentsContainer.appendChild(commentElement);
    });
}

// Create comment element
function createCommentElement(comment) {
    const commentDiv = document.createElement('div');
    commentDiv.className = 'comment';
    
    const timeAgo = getTimeAgo(comment.created_at);
    const authorName = comment.is_anonymous ? comment.anonymous_id : (comment.display_name || comment.anonymous_id);
    
    commentDiv.innerHTML = `
        <div class="comment-content">${escapeHtml(comment.content)}</div>
        <div class="comment-footer">
            <span class="comment-author">${escapeHtml(authorName)}</span>
            <span class="comment-time">${timeAgo}</span>
        </div>
    `;
    
    return commentDiv;
}

// Add comment to a post
async function addComment(postId) {
    const commentForm = document.querySelector(`#comments-${postId} .comment-form`);
    const textarea = commentForm.querySelector('textarea');
    const content = textarea.value.trim();
    
    if (!content) {
        showErrorMessage('Please enter a comment');
        return;
    }
    
    try {
        // Simulate API call
        await simulateAPICall(1000);
        
        // Create new comment
        const newComment = {
            id: Date.now(),
            content: content,
            anonymous_id: AppState.currentUser.anonymousId,
            created_at: new Date().toISOString(),
            is_anonymous: true
        };
        
        // Add to post's comments
        const post = AppState.posts.find(p => p.id === postId);
        if (post) {
            post.comments_count++;
            displayPosts();
        }
        
        // Add to comments display
        const commentsContainer = commentForm.previousElementSibling;
        const commentElement = createCommentElement(newComment);
        commentsContainer.appendChild(commentElement);
        
        // Clear textarea
        textarea.value = '';
        
        showSuccessMessage('Comment added successfully');
        
    } catch (error) {
        console.error('Add comment error:', error);
        showErrorMessage('Failed to add comment');
    }
}

// Load more posts
function loadMorePosts() {
    AppState.currentPage++;
    loadPosts(AppState.currentPage, true);
}

// Show load more button
function showLoadMoreButton() {
    const loadMoreContainer = document.getElementById('load-more-container');
    if (loadMoreContainer) {
        loadMoreContainer.style.display = 'block';
    }
}

// Load chat rooms
async function loadChatRooms() {
    if (AppState.isLoading) return;
    
    AppState.isLoading = true;
    showLoadingState('rooms');
    
    try {
        // Simulate API call
        await simulateAPICall(1200);
        
        // Generate demo chat rooms
        AppState.chatRooms = generateDemoChatRooms();
        displayChatRooms();
        hideLoadingState('rooms');
        
    } catch (error) {
        console.error('Load chat rooms error:', error);
        showErrorMessage('Failed to load chat rooms');
        hideLoadingState('rooms');
    } finally {
        AppState.isLoading = false;
    }
}

// Generate demo chat rooms
function generateDemoChatRooms() {
    return [
        {
            id: 1,
            name: 'General Support & Discussion',
            description: 'A safe space for general support, questions, and conversation',
            type: 'general',
            participant_count: 23,
            is_active: true
        },
        {
            id: 2,
            name: 'Healing Journey Support',
            description: 'Share your healing journey, progress, and support others on their path',
            type: 'healing',
            participant_count: 17,
            is_active: true
        },
        {
            id: 3,
            name: 'Crisis & Immediate Support',
            description: 'Immediate support for those in crisis or having a difficult time',
            type: 'crisis',
            participant_count: 8,
            is_active: true
        },
        {
            id: 4,
            name: 'Resources & Professional Help',
            description: 'Share helpful resources, therapist recommendations, and professional advice',
            type: 'resources',
            participant_count: 14,
            is_active: true
        },
        {
            id: 5,
            name: 'New Members Welcome',
            description: 'Welcome new members and help them feel comfortable in the community',
            type: 'welcome',
            participant_count: 31,
            is_active: true
        }
    ];
}

// Display chat rooms
function displayChatRooms() {
    if (!DOM.roomsGrid) return;
    
    DOM.roomsGrid.innerHTML = '';
    
    AppState.chatRooms.forEach(room => {
        const roomElement = createChatRoomElement(room);
        DOM.roomsGrid.appendChild(roomElement);
    });
}

// Create chat room element
function createChatRoomElement(room) {
    const roomDiv = document.createElement('div');
    roomDiv.className = 'chat-room';
    
    roomDiv.innerHTML = `
        <div class="room-info">
            <div class="room-type">${room.type}</div>
            <h4>${escapeHtml(room.name)}</h4>
            <p>${escapeHtml(room.description)}</p>
            <div class="participant-count">
                <i class="fas fa-users"></i> ${room.participant_count} participants
            </div>
        </div>
        <button class="join-room-btn" onclick="joinChatRoom(${room.id})">
            <i class="fas fa-sign-in-alt"></i> Join Room
        </button>
    `;
    
    return roomDiv;
}

// Join chat room
async function joinChatRoom(roomId) {
    try {
        // Simulate API call
        await simulateAPICall(800);
        
        AppState.currentRoomId = roomId;
        const room = AppState.chatRooms.find(r => r.id === roomId);
        
        if (room) {
            showChatMessages(roomId);
            loadChatMessages(roomId);
            startMessagePolling();
        }
        
    } catch (error) {
        console.error('Join room error:', error);
        showErrorMessage('Failed to join chat room');
    }
}

// Show chat messages interface
function showChatMessages(roomId) {
    const chatRoomsList = document.getElementById('chat-rooms-list');
    const chatMessages = document.getElementById('chat-messages');
    const currentRoomName = document.getElementById('current-room-name');
    const currentRoomDescription = document.getElementById('current-room-description');
    
    if (chatRoomsList && chatMessages) {
        chatRoomsList.style.display = 'none';
        chatMessages.style.display = 'flex';
        
        const room = AppState.chatRooms.find(r => r.id === roomId);
        if (room && currentRoomName && currentRoomDescription) {
            currentRoomName.textContent = room.name;
            currentRoomDescription.textContent = room.description;
        }
    }
}

// Load chat messages
async function loadChatMessages(roomId) {
    try {
        // Simulate API call
        await simulateAPICall(600);
        
        // Generate demo messages
        const messages = generateDemoMessages(roomId);
        displayChatMessages(messages);
        
    } catch (error) {
        console.error('Load messages error:', error);
        showErrorMessage('Failed to load messages');
    }
}

// Generate demo messages
function generateDemoMessages(roomId) {
    const messageTexts = [
        'Hi everyone, I\'m new here and feeling a bit nervous. Thank you for creating this safe space.',
        'Welcome! You\'re absolutely safe here. We\'re all here to support each other.',
        'Thank you for the warm welcome. It means so much to feel understood.',
        'We\'re all on this healing journey together. You\'re not alone.',
        'Has anyone found any good therapists in the NYC area? I\'m looking for someone who specializes in trauma.',
        'I found this book really helpful: "The Body Keeps the Score" by van der Kolk. It helped me understand trauma better.',
        'Thank you for sharing that! I\'ve been looking for resources to help me understand what I\'m going through.',
        'You\'re not alone in this journey. We\'re all here for each other.',
        'Sending love and strength to everyone here. This community has been a lifeline for me.',
        'This community has been so helpful for me. I finally feel like I\'m not crazy for feeling the way I do.',
        'Has anyone tried EMDR therapy? I\'ve heard it can be really effective for trauma.',
        'I\'ve been doing EMDR for 3 months now and it\'s been life-changing. Highly recommend finding a qualified therapist.',
        'Thank you for sharing your experience. It gives me hope that healing is possible.',
        'I\'m having a really hard day today. The flashbacks are really bad.',
        'I\'m so sorry you\'re going through that. Flashbacks are so difficult. Have you tried grounding techniques?',
        'Yes, I use the 5-4-3-2-1 technique. It helps me stay present when I\'m feeling overwhelmed.',
        'Thank you for that tip! I\'ll definitely try it next time.'
    ];
    
    const realisticNames = [
        'Emma', 'Sophia', 'Olivia', 'Ava', 'Isabella', 'Mia', 'Charlotte', 'Amelia',
        'Harper', 'Evelyn', 'Abigail', 'Emily', 'Sofia', 'Avery', 'Ella', 'Madison',
        'Scarlett', 'Victoria', 'Aria', 'Grace', 'Chloe', 'Camila', 'Penelope', 'Layla',
        'Riley', 'Zoey', 'Nora', 'Lily', 'Eleanor', 'Hannah', 'Luna', 'Savannah',
        'Zoe', 'Stella', 'Hazel', 'Lucy', 'Paisley', 'Ellie', 'Aurora', 'Natalie'
    ];
    
    return messageTexts.map((text, index) => {
        const randomName = realisticNames[Math.floor(Math.random() * realisticNames.length)];
        return {
            id: Date.now() + index,
            content: text,
            anonymous_id: randomName + '_' + Math.random().toString(36).substr(2, 4),
            created_at: new Date(Date.now() - Math.random() * 60 * 60 * 1000).toISOString(),
            is_anonymous: true
        };
    });
}

// Display chat messages
function displayChatMessages(messages) {
    if (!DOM.messagesContainer) return;
    
    DOM.messagesContainer.innerHTML = '';
    
    if (messages.length === 0) {
        DOM.messagesContainer.innerHTML = `
            <div class="no-messages">
                <i class="fas fa-comments"></i>
                <p>No messages yet. Be the first to say hello!</p>
            </div>
        `;
        return;
    }
    
    messages.forEach(message => {
        const messageElement = createChatMessageElement(message);
        DOM.messagesContainer.appendChild(messageElement);
    });
    
    // Scroll to bottom
    DOM.messagesContainer.scrollTop = DOM.messagesContainer.scrollHeight;
}

// Create chat message element
function createChatMessageElement(message) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'chat-message';
    
    const timeAgo = getTimeAgo(message.created_at);
    const authorName = message.is_anonymous ? message.anonymous_id : (message.display_name || message.anonymous_id);
    
    messageDiv.innerHTML = `
        <div class="message-header">
            <span class="message-author">${escapeHtml(authorName)}</span>
            <span class="message-time">${timeAgo}</span>
        </div>
        <div class="message-content">${escapeHtml(message.content)}</div>
    `;
    
    return messageDiv;
}

// Handle message submission
async function handleMessageSubmission(e) {
    e.preventDefault();
    
    const messageInput = document.getElementById('message-input');
    const content = messageInput.value.trim();
    
    if (!content) {
        showErrorMessage('Please enter a message');
        return;
    }
    
    try {
        // Simulate API call
        await simulateAPICall(500);
        
        // Create new message
        const newMessage = {
            id: Date.now(),
            content: content,
            anonymous_id: AppState.currentUser.anonymousId,
            created_at: new Date().toISOString(),
            is_anonymous: true
        };
        
        // Add to messages container
        const messageElement = createChatMessageElement(newMessage);
        DOM.messagesContainer.appendChild(messageElement);
        
        // Clear input and scroll to bottom
        messageInput.value = '';
        DOM.messagesContainer.scrollTop = DOM.messagesContainer.scrollHeight;
        
    } catch (error) {
        console.error('Message submission error:', error);
        showErrorMessage('Failed to send message');
    }
}

// Start message polling
function startMessagePolling() {
    if (AppState.messagePollingInterval) {
        clearInterval(AppState.messagePollingInterval);
    }
    
    AppState.messagePollingInterval = setInterval(() => {
        if (AppState.currentRoomId) {
            // Simulate receiving new messages
            if (Math.random() < 0.3) { // 30% chance of new message
                const newMessage = {
                    id: Date.now(),
                    content: generateRandomMessage(),
                    anonymous_id: 'Anonymous_' + Math.random().toString(36).substr(2, 6),
                    created_at: new Date().toISOString(),
                    is_anonymous: true
                };
                
                const messageElement = createChatMessageElement(newMessage);
                DOM.messagesContainer.appendChild(messageElement);
                DOM.messagesContainer.scrollTop = DOM.messagesContainer.scrollHeight;
            }
        }
    }, 5000); // Poll every 5 seconds
}

// Generate random message for demo
function generateRandomMessage() {
    const messages = [
        'Thank you for sharing that. It takes courage to open up.',
        'You\'re not alone in feeling this way. Many of us have been there.',
        'Sending you strength and love. You\'re doing amazing.',
        'This community is here for you. We believe you and support you.',
        'Thank you for being so brave and sharing your story.',
        'You\'re doing great, even if it doesn\'t feel like it right now.',
        'We believe you. Your experience is valid and real.',
        'You\'re stronger than you know. Healing takes time.',
        'I\'m here if you need to talk. Sometimes just being heard helps.',
        'You\'re not broken. What happened to you doesn\'t define you.',
        'Have you tried any grounding techniques? They help me when I\'m overwhelmed.',
        'Remember to be gentle with yourself. Healing isn\'t linear.'
    ];
    
    return messages[Math.floor(Math.random() * messages.length)];
}

// Show chat rooms list
function showChatRooms() {
    const chatRoomsList = document.getElementById('chat-rooms-list');
    const chatMessages = document.getElementById('chat-messages');
    
    if (chatRoomsList && chatMessages) {
        chatRoomsList.style.display = 'block';
        chatMessages.style.display = 'none';
    }
    
    // Stop message polling
    if (AppState.messagePollingInterval) {
        clearInterval(AppState.messagePollingInterval);
        AppState.messagePollingInterval = null;
    }
    
    AppState.currentRoomId = null;
}

// Load support resources
async function loadSupportResources() {
    try {
        // Simulate API call
        await simulateAPICall(800);
        
        // Generate demo resources
        const resources = generateDemoResources();
        displaySupportResources(resources);
        
    } catch (error) {
        console.error('Load resources error:', error);
        showErrorMessage('Failed to load resources');
    }
}

// Generate demo resources
function generateDemoResources() {
    return [
        {
            id: 1,
            title: 'Understanding Trauma',
            description: 'Educational resources about trauma and its effects',
            url: 'https://www.rainn.org/articles/trauma',
            type: 'education'
        },
        {
            id: 2,
            title: 'Self-Care Techniques',
            description: 'Practical self-care strategies for healing',
            url: 'https://www.rainn.org/self-care',
            type: 'self-care'
        },
        {
            id: 3,
            title: 'Legal Resources',
            description: 'Information about legal rights and options',
            url: 'https://www.rainn.org/legal-resources',
            type: 'legal'
        },
        {
            id: 4,
            title: 'Therapy Directory',
            description: 'Find qualified therapists in your area',
            url: 'https://www.psychologytoday.com/us/therapists',
            type: 'therapy'
        }
    ];
}

// Display support resources
function displaySupportResources(resources) {
    const resourcesGrid = document.getElementById('resources-grid');
    if (!resourcesGrid) return;
    
    resourcesGrid.innerHTML = '';
    
    resources.forEach(resource => {
        const resourceElement = createResourceElement(resource);
        resourcesGrid.appendChild(resourceElement);
    });
}

// Create resource element
function createResourceElement(resource) {
    const resourceDiv = document.createElement('div');
    resourceDiv.className = 'resource-card';
    
    resourceDiv.innerHTML = `
        <h4>${escapeHtml(resource.title)}</h4>
        <p>${escapeHtml(resource.description)}</p>
        <a href="${resource.url}" target="_blank" class="resource-link">
            <i class="fas fa-external-link-alt"></i> Learn More
        </a>
    `;
    
    return resourceDiv;
}

// Handle report submission
async function handleReportSubmission(e) {
    e.preventDefault();
    
    const reason = document.getElementById('report-reason').value;
    const description = document.getElementById('report-description').value.trim();
    
    if (!reason) {
        showErrorMessage('Please select a reason for the report');
        return;
    }
    
    try {
        // Simulate API call
        await simulateAPICall(1500);
        
        closeModal('report-modal');
        showSuccessMessage('Report submitted successfully. Thank you for helping keep our community safe.');
        
        // Reset form
        document.getElementById('report-form').reset();
        
    } catch (error) {
        console.error('Report submission error:', error);
        showErrorMessage('Failed to submit report');
    }
}

// Show report modal
function showReportModal(type, id) {
    const modal = document.getElementById('report-modal');
    if (modal) {
        modal.classList.add('show');
    }
}

// Logout function
async function logout() {
    try {
        // Simulate API call
        await simulateAPICall(500);
        
        // Clear state
        AppState.isLoggedIn = false;
        AppState.currentUser = null;
        AppState.posts = [];
        AppState.chatRooms = [];
        
        // Stop message polling
        if (AppState.messagePollingInterval) {
            clearInterval(AppState.messagePollingInterval);
            AppState.messagePollingInterval = null;
        }
        
        // Show welcome section
        showWelcomeSection();
        
        // Hide user info
        const userInfo = document.getElementById('user-info');
        if (userInfo) {
            userInfo.style.display = 'none';
        }
        
        showSuccessMessage('You have left SafeSpace safely');
        
    } catch (error) {
        console.error('Logout error:', error);
        showErrorMessage('Failed to logout');
    }
}

// Emergency exit function
function emergencyExit() {
    // Clear all data
    localStorage.clear();
    sessionStorage.clear();
    
    // Redirect to a safe website
    window.location.href = 'https://www.google.com';
}

// Show new post form
function showNewPostForm() {
    const form = document.getElementById('new-post-form');
    if (form) {
        form.style.display = 'block';
        document.getElementById('post-content').focus();
    }
}

// Hide new post form
function hideNewPostForm() {
    const form = document.getElementById('new-post-form');
    if (form) {
        form.style.display = 'none';
    }
}

// Show loading state
function showLoadingState(type) {
    const containers = {
        posts: DOM.postsFeed,
        rooms: DOM.roomsGrid,
        resources: document.getElementById('resources-grid')
    };
    
    const container = containers[type];
    if (container) {
        container.innerHTML = `
            <div class="loading-${type}">
                <div class="loading-spinner"></div>
                <p>Loading ${type}...</p>
            </div>
        `;
    }
}

// Hide loading state
function hideLoadingState(type) {
    // Loading state is cleared when content is displayed
}

// Show success message
function showSuccessMessage(message) {
    showMessageToast(message, 'success');
}

// Show error message
function showErrorMessage(message) {
    showMessageToast(message, 'error');
}

// Show warning message
function showWarningMessage(message) {
    showMessageToast(message, 'warning');
}

// Show message toast
function showMessageToast(message, type) {
    if (!DOM.messageToast) return;
    
    DOM.messageToast.textContent = message;
    DOM.messageToast.className = `message-toast ${type} show`;
    
    setTimeout(() => {
        DOM.messageToast.classList.remove('show');
    }, 5000);
}

// Close modal
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('show');
    }
}

// Close all modals
function closeAllModals() {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.classList.remove('show');
    });
}

// Show privacy policy
function showPrivacyPolicy() {
    const modal = document.getElementById('privacy-modal');
    if (modal) {
        modal.classList.add('show');
    }
}

// Show terms
function showTerms() {
    const modal = document.getElementById('terms-modal');
    if (modal) {
        modal.classList.add('show');
    }
}

// Show safety info
function showSafetyInfo() {
    const modal = document.getElementById('safety-modal');
    if (modal) {
        modal.classList.add('show');
    }
}

// Utility functions
function getTimeAgo(timestamp) {
    const now = new Date();
    const past = new Date(timestamp);
    const diffInSeconds = Math.floor((now - past) / 1000);
    
    if (diffInSeconds < 60) {
        return 'Just now';
    } else if (diffInSeconds < 3600) {
        const minutes = Math.floor(diffInSeconds / 60);
        return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else if (diffInSeconds < 86400) {
        const hours = Math.floor(diffInSeconds / 3600);
        return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else {
        const days = Math.floor(diffInSeconds / 86400);
        return `${days} day${days > 1 ? 's' : ''} ago`;
    }
}

function getTypeLabel(type) {
    const labels = {
        support: 'Support',
        share: 'Share',
        advice: 'Advice',
        healing: 'Healing',
        resources: 'Resources'
    };
    
    return labels[type] || 'General';
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Simulate API call for demo purposes
function simulateAPICall(delay) {
    return new Promise((resolve) => {
        setTimeout(resolve, delay);
    });
} 