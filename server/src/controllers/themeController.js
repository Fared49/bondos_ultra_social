import Theme from '../models/Theme.js';
import User from '../models/User.js';

export const getAllThemes = async (req, res, next) => {
  try {
    const themes = await Theme.find();
    res.json(themes);
  } catch (error) {
    next(error);
  }
};

export const createTheme = async (req, res, next) => {
  try {
    const { name, description, colors, isDefault } = req.body;

    if (!name || !colors) {
      return res.status(400).json({ message: 'Theme name and colors are required' });
    }

    const theme = new Theme({
      name,
      description,
      colors,
      isDefault,
    });

    await theme.save();

    res.status(201).json({
      message: 'Theme created successfully',
      theme,
    });
  } catch (error) {
    next(error);
  }
};

export const getUserTheme = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user.theme);
  } catch (error) {
    next(error);
  }
};

export const setUserTheme = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { mode, primaryColor, accentColor } = req.body;
    const currentUserId = req.userId;

    if (userId !== currentUserId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      {
        theme: {
          mode: mode || 'light',
          primaryColor: primaryColor || '#3B82F6',
          accentColor: accentColor || '#10B981',
        },
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      message: 'Theme updated successfully',
      theme: user.theme,
    });
  } catch (error) {
    next(error);
  }
};
