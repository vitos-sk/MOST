import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import styled from "styled-components";
import { theme } from "../../../theme/theme";
import {
  // Heroicons (современные, минималистичные)
  FaRocket,
  FaLeaf,
  FaDollarSign,
  FaQuestionCircle,
  FaUser,
  FaHeart,
  FaCog,
  FaBriefcase,
  FaHome,
  FaGraduationCap,
  FaGamepad,
  FaMusic,
  FaFilm,
  FaShoppingBag,
  FaUtensils,
  FaCoffee,
  FaHeartbeat,
  FaRunning,
  FaBook,
  FaLaptop,
  FaMobileAlt,
  FaCamera,
  FaPalette,
  FaFutbol,
  FaBasketballBall,
  FaSwimmer,
  FaBicycle,
  FaMountain,
  FaSun,
  FaMoon,
  FaStar,
  FaGift,
  FaBirthdayCake,
  FaUsers,
  FaHandshake,
  FaComments,
  FaLightbulb,
  FaChartLine,
  FaBuilding,
  FaCity,
  FaGlobe,
  FaMapMarkerAlt,
  FaCalendar,
  FaClock,
  FaBell,
  FaEnvelope,
  FaPhone,
  FaVideo,
  FaMicrophone,
  FaHeadphones,
  FaTv,
  FaNewspaper,
  FaBookOpen,
  FaPen,
  FaPencilAlt,
  FaPaintBrush,
  FaCode,
  FaDatabase,
  FaCloud,
  FaWifi,
  FaLock,
  FaShieldAlt,
  FaKey,
  FaCreditCard,
  FaWallet,
  FaGem,
  FaCrown,
  FaTrophy,
  FaMedal,
  FaAward,
  FaFire,
  FaMagic,
  FaGhost,
  FaDragon,
  FaCat,
  FaDog,
  FaFish,
  FaTree,
  FaUmbrella,
  FaSnowflake,
  FaBolt,
} from "react-icons/fa";

// Объединяем все иконки в один массив с метаданными
const iconCategories = [
  {
    name: "Основные",
    icons: [
      { name: "Ракета", icon: FaRocket, value: "rocket" },
      { name: "Лист", icon: FaLeaf, value: "leaf" },
      { name: "Деньги", icon: FaDollarSign, value: "money" },
      { name: "Вопрос", icon: FaQuestionCircle, value: "question" },
      { name: "Пользователь", icon: FaUser, value: "user" },
      { name: "Сердце", icon: FaHeart, value: "heart" },
      { name: "Настройки", icon: FaCog, value: "settings" },
      { name: "Портфель", icon: FaBriefcase, value: "briefcase" },
    ],
  },
  {
    name: "Жизнь и дом",
    icons: [
      { name: "Дом", icon: FaHome, value: "home" },
      { name: "Еда", icon: FaUtensils, value: "food" },
      { name: "Кофе", icon: FaCoffee, value: "coffee" },
      { name: "Покупки", icon: FaShoppingBag, value: "shopping" },
      { name: "Здоровье", icon: FaHeartbeat, value: "health" },
      { name: "Спорт", icon: FaRunning, value: "sport" },
      { name: "Природа", icon: FaTree, value: "nature" },
      { name: "Цветок", icon: FaLeaf, value: "flower" },
    ],
  },
  {
    name: "Образование и работа",
    icons: [
      { name: "Образование", icon: FaGraduationCap, value: "education" },
      { name: "Работа", icon: FaBriefcase, value: "work" },
      { name: "Книга", icon: FaBook, value: "book" },
      { name: "Офис", icon: FaBuilding, value: "office" },
      { name: "Город", icon: FaCity, value: "city" },
      { name: "Глобус", icon: FaGlobe, value: "globe" },
    ],
  },
  {
    name: "Развлечения",
    icons: [
      { name: "Игры", icon: FaGamepad, value: "games" },
      { name: "Музыка", icon: FaMusic, value: "music" },
      { name: "Кино", icon: FaFilm, value: "movie" },
      { name: "Камера", icon: FaCamera, value: "camera" },
      { name: "Палитра", icon: FaPalette, value: "art" },
      { name: "Футбол", icon: FaFutbol, value: "football" },
      { name: "Баскетбол", icon: FaBasketballBall, value: "basketball" },
      { name: "Плавание", icon: FaSwimmer, value: "swimming" },
      { name: "Велосипед", icon: FaBicycle, value: "bicycle" },
    ],
  },
  {
    name: "Технологии",
    icons: [
      { name: "Ноутбук", icon: FaLaptop, value: "laptop" },
      { name: "Телефон", icon: FaMobileAlt, value: "phone" },
      { name: "Код", icon: FaCode, value: "code" },
      { name: "База данных", icon: FaDatabase, value: "database" },
      { name: "Облако", icon: FaCloud, value: "cloud" },
      { name: "WiFi", icon: FaWifi, value: "wifi" },
      { name: "Безопасность", icon: FaShieldAlt, value: "security" },
    ],
  },
  {
    name: "Социальное",
    icons: [
      { name: "Люди", icon: FaUsers, value: "people" },
      { name: "Рукопожатие", icon: FaHandshake, value: "handshake" },
      { name: "Комментарии", icon: FaComments, value: "comments" },
      { name: "Идея", icon: FaLightbulb, value: "idea" },
      { name: "График", icon: FaChartLine, value: "chart" },
      { name: "Календарь", icon: FaCalendar, value: "calendar" },
    ],
  },
  {
    name: "Финансы",
    icons: [
      { name: "Кошелек", icon: FaWallet, value: "wallet" },
      { name: "Кредитная карта", icon: FaCreditCard, value: "card" },
      { name: "Драгоценность", icon: FaGem, value: "gem" },
      { name: "Корона", icon: FaCrown, value: "crown" },
    ],
  },
  {
    name: "Достижения",
    icons: [
      { name: "Трофей", icon: FaTrophy, value: "trophy" },
      { name: "Медаль", icon: FaMedal, value: "medal" },
      { name: "Награда", icon: FaAward, value: "award" },
      { name: "Огонь", icon: FaFire, value: "fire" },
      { name: "Звезда", icon: FaStar, value: "star" },
    ],
  },
  {
    name: "Природа и погода",
    icons: [
      { name: "Гора", icon: FaMountain, value: "mountain" },
      { name: "Солнце", icon: FaSun, value: "sun" },
      { name: "Луна", icon: FaMoon, value: "moon" },
      { name: "Снежинка", icon: FaSnowflake, value: "snow" },
      { name: "Дождь", icon: FaCloud, value: "rain" },
      { name: "Гроза", icon: FaBolt, value: "storm" },
    ],
  },
  {
    name: "Особые",
    icons: [
      { name: "Подарок", icon: FaGift, value: "gift" },
      { name: "День рождения", icon: FaBirthdayCake, value: "birthday" },
      { name: "Магия", icon: FaMagic, value: "magic" },
      { name: "Призрак", icon: FaGhost, value: "ghost" },
      { name: "Дракон", icon: FaDragon, value: "dragon" },
      { name: "Кот", icon: FaCat, value: "cat" },
      { name: "Собака", icon: FaDog, value: "dog" },
    ],
  },
];

export function IconPicker({ value, onChange, label = "Выберите иконку" }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });
  const containerRef = useRef(null);
  const buttonRef = useRef(null);
  const dropdownRef = useRef(null);

  // Находим выбранную иконку
  const selectedIconData = iconCategories
    .flatMap((cat) => cat.icons)
    .find((icon) => icon.value === value);

  // Фильтруем иконки по поиску
  const filteredCategories = iconCategories
    .map((category) => ({
      ...category,
      icons: category.icons.filter(
        (icon) =>
          icon.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          icon.value.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    }))
    .filter((category) => category.icons.length > 0);

  // Сбрасываем выбранную категорию, если она не существует в отфильтрованных
  useEffect(() => {
    if (filteredCategories.length > 0 && selectedCategory >= filteredCategories.length) {
      setSelectedCategory(0);
    }
  }, [filteredCategories.length, selectedCategory]);

  const handleIconSelect = (iconValue) => {
    if (!iconValue) return;

    // Создаем синтетическое событие для совместимости с формой
    // Структура должна точно соответствовать нативному событию input
    const syntheticEvent = {
      target: {
        name: "emoji",
        value: String(iconValue), // Убеждаемся, что это строка
      },
      currentTarget: {
        name: "emoji",
        value: String(iconValue),
      },
    };

    // Вызываем onChange с правильным событием ПЕРЕД закрытием
    // Важно: вызываем синхронно, чтобы значение успело сохраниться
    if (onChange && typeof onChange === "function") {
      try {
        onChange(syntheticEvent);
      } catch (error) {
        console.error("Error in IconPicker onChange:", error);
      }
    }

    // Закрываем dropdown после обработки события
    setIsOpen(false);
    setSearchQuery("");
  };

  // Вычисляем позицию выпадающего списка при открытии
  const updateDropdownPosition = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const isMobile = window.innerWidth < parseInt(theme.breakpoints.sm);

      if (isMobile) {
        // На мобильных - фиксированная позиция снизу
        setDropdownPosition({
          top: 0,
          left: 0,
          width: window.innerWidth,
        });
      } else {
        // На десктопе - умное позиционирование
        const dropdownWidth = 600;
        const dropdownHeight = 500;
        const spacing = 12;
        const viewportPadding = 16;

        // Пробуем разместить справа от кнопки
        let left = rect.right + spacing;
        let top = rect.top;

        // Если не помещается справа, размещаем слева
        if (left + dropdownWidth > window.innerWidth - viewportPadding) {
          left = rect.left - dropdownWidth - spacing;
          // Если и слева не помещается, центрируем по горизонтали
          if (left < viewportPadding) {
            left = Math.max(viewportPadding, (window.innerWidth - dropdownWidth) / 2);
          }
        }

        // Выравниваем по вертикали: стараемся показать над кнопкой, но не выше экрана
        if (top + dropdownHeight > window.innerHeight - viewportPadding) {
          top = window.innerHeight - dropdownHeight - viewportPadding;
        }
        if (top < viewportPadding) {
          top = viewportPadding;
        }

        setDropdownPosition({
          top: top,
          left: left,
          width: dropdownWidth,
        });
      }
    }
  };

  const handleToggle = () => {
    if (!isOpen) {
      updateDropdownPosition();
    }
    setIsOpen(!isOpen);
  };

  // Обновляем позицию только при изменении размера окна (не при скролле)
  useEffect(() => {
    if (isOpen) {
      const updatePosition = () => {
        updateDropdownPosition();
      };

      window.addEventListener("resize", updatePosition);

      return () => {
        window.removeEventListener("resize", updatePosition);
      };
    }
  }, [isOpen]);

  // Закрываем выпадающий список при клике вне компонента
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Проверяем, что клик был вне dropdown и не на кнопке открытия
      const target = event.target;
      if (!target) return;

      const clickedInsideDropdown =
        dropdownRef.current && dropdownRef.current.contains(target);
      const clickedInsideButton = buttonRef.current && buttonRef.current.contains(target);
      const clickedInsideContainer =
        containerRef.current && containerRef.current.contains(target);

      // Закрываем только если клик был вне всех элементов
      if (!clickedInsideDropdown && !clickedInsideButton && !clickedInsideContainer) {
        setIsOpen(false);
        setSearchQuery("");
      }
    };

    // Предотвращаем скролл body на мобильных при открытом dropdown
    if (isOpen) {
      // Используем bubble phase (false) вместо capture phase, чтобы события внутри dropdown
      // обрабатывались первыми благодаря stopPropagation()
      document.addEventListener("mousedown", handleClickOutside, false);
      document.addEventListener("touchstart", handleClickOutside, false);

      // Блокируем скролл body на мобильных
      if (window.innerWidth < parseInt(theme.breakpoints.sm)) {
        document.body.style.overflow = "hidden";
      }

      return () => {
        document.removeEventListener("mousedown", handleClickOutside, false);
        document.removeEventListener("touchstart", handleClickOutside, false);
        document.body.style.overflow = "";
      };
    }
  }, [isOpen]);

  return (
    <Container ref={containerRef}>
      <Label>{label}</Label>
      <PickerButton ref={buttonRef} type="button" onClick={handleToggle}>
        {selectedIconData ? (
          <IconPreview>
            <selectedIconData.icon />
            <IconName>{selectedIconData.name}</IconName>
          </IconPreview>
        ) : (
          <Placeholder>Нажмите для выбора иконки</Placeholder>
        )}
        <Arrow $isOpen={isOpen}>▼</Arrow>
      </PickerButton>

      {isOpen &&
        createPortal(
          <>
            <Overlay
              onClick={() => {
                setIsOpen(false);
                setSearchQuery("");
              }}
            />
            <Dropdown
              ref={dropdownRef}
              $position={dropdownPosition}
              onMouseDown={(e) => {
                // Предотвращаем закрытие dropdown при клике внутри
                e.stopPropagation();
              }}
              onClick={(e) => {
                // Останавливаем всплытие всех кликов внутри dropdown
                e.stopPropagation();
              }}
            >
              <DragHandle />
              <SearchWrapper>
                <SearchInput
                  type="text"
                  placeholder="Поиск иконки..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                />
              </SearchWrapper>

              <CategoryTabs>
                {filteredCategories.map((category, index) => (
                  <CategoryTab
                    key={category.name}
                    $active={selectedCategory === index}
                    onMouseDown={(e) => {
                      e.stopPropagation();
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedCategory(index);
                    }}
                  >
                    {category.name}
                  </CategoryTab>
                ))}
              </CategoryTabs>

              <IconsGrid>
                {filteredCategories[selectedCategory]?.icons.map((iconData) => (
                  <IconButton
                    key={iconData.value}
                    type="button"
                    $selected={value === iconData.value}
                    onMouseDown={(e) => {
                      // Останавливаем всплытие, но НЕ предотвращаем событие
                      // preventDefault() блокирует последующий onClick
                      e.stopPropagation();
                    }}
                    onClick={(e) => {
                      // Останавливаем всплытие события
                      e.stopPropagation();

                      // Убеждаемся, что значение передается
                      if (iconData.value) {
                        handleIconSelect(iconData.value);
                      }
                    }}
                    onTouchStart={(e) => {
                      // Для мобильных устройств
                      e.stopPropagation();
                    }}
                    title={iconData.name}
                  >
                    <iconData.icon />
                    <IconLabel>{iconData.name}</IconLabel>
                  </IconButton>
                ))}
              </IconsGrid>
            </Dropdown>
          </>,
          document.body
        )}
    </Container>
  );
}

const Container = styled.div`
  position: relative;
  width: 100%;
  z-index: 1;
  isolation: isolate;

  @media (max-width: ${theme.breakpoints.sm}) {
    z-index: auto;
  }
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(44, 44, 44, 0.4);
  z-index: 9998;
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  animation: fadeIn 0.2s ease-out;

  @media (min-width: ${theme.breakpoints.sm}) {
    display: none;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

const DragHandle = styled.div`
  display: none;
  width: 40px;
  height: 4px;
  background: ${theme.colors.border.default};
  border-radius: 0;
  margin: ${theme.spacing.sm} auto;
  cursor: grab;

  &:active {
    cursor: grabbing;
  }

  @media (max-width: ${theme.breakpoints.sm}) {
    display: block;
  }
`;

const Label = styled.label`
  display: block;
  margin-bottom: ${theme.spacing.sm};
  font-size: ${theme.typography.sizes.sm};
  font-weight: ${theme.typography.weights.medium};
  color: ${theme.colors.text.primary};
`;

const PickerButton = styled.button`
  width: 100%;
  padding: ${theme.spacing.md} ${theme.spacing.lg};
  background: ${theme.colors.bg.card};
  border: 1px solid ${theme.colors.border.default};
  border-radius: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${theme.spacing.md};
  transition: all ${theme.transition.base};
  color: ${theme.colors.text.primary};
  min-height: 48px;

  &:hover {
    border-color: ${theme.colors.border.accent};
    background: ${theme.colors.bg.cardHover};
  }

  &:focus {
    outline: 2px solid ${theme.colors.accent.primary};
    outline-offset: 2px;
  }

  &:active {
    transform: scale(0.98);
  }

  @media (min-width: ${theme.breakpoints.sm}) {
    padding: ${theme.spacing.md} ${theme.spacing.lg};
  }

  @media (max-width: ${theme.breakpoints.sm}) {
    padding: ${theme.spacing.sm} ${theme.spacing.md};
    min-height: 44px;
  }
`;

const IconPreview = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.md};
  flex: 1;

  svg {
    width: 24px;
    height: 24px;
    color: ${theme.colors.accent.primary};
  }
`;

const IconName = styled.span`
  font-size: ${theme.typography.sizes.md};
  color: ${theme.colors.text.primary};
`;

const Placeholder = styled.span`
  color: ${theme.colors.text.secondary};
  font-size: ${theme.typography.sizes.md};
  flex: 1;
  text-align: left;
`;

const Arrow = styled.span`
  font-size: ${theme.typography.sizes.sm};
  color: ${theme.colors.text.secondary};
  transition: transform ${theme.transition.base};
  transform: rotate(${(props) => (props.$isOpen ? "180deg" : "0deg")});
`;

const Dropdown = styled.div`
  position: fixed;
  top: ${(props) => props.$position?.top || 0}px;
  left: ${(props) => props.$position?.left || 0}px;
  width: ${(props) => props.$position?.width || 600}px;
  background: ${theme.colors.bg.card};
  backdrop-filter: blur(10px) saturate(120%);
  -webkit-backdrop-filter: blur(10px) saturate(120%);
  border: 1px solid ${theme.colors.border.default};
  border-radius: 0;
  box-shadow: none;
  z-index: 99999;
  max-height: 500px;
  min-width: 400px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  pointer-events: auto;
  animation: fadeInDropdown 0.2s ease-out;

  @keyframes fadeInDropdown {
    from {
      opacity: 0;
      transform: scale(0.95) translateY(-10px);
    }
    to {
      opacity: 1;
      transform: scale(1) translateY(0);
    }
  }

  @media (min-width: ${theme.breakpoints.sm}) {
    box-shadow: none;
    width: 600px;
    min-width: 500px;
    max-width: 90vw;
  }

  @media (max-width: ${theme.breakpoints.sm}) {
    position: fixed !important;
    top: auto !important;
    bottom: 0 !important;
    left: 0 !important;
    right: 0 !important;
    width: 100% !important;
    max-width: 100% !important;
    min-width: auto !important;
    margin: 0;
    border-radius: 0;
    max-height: 85vh;
    box-shadow: none;
    z-index: 99999;
    animation: slideUp 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  @keyframes slideUp {
    from {
      transform: translateY(100%);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
`;

const SearchWrapper = styled.div`
  padding: ${theme.spacing.lg};
  border-bottom: 1px solid ${theme.colors.border.default};
  background: ${theme.colors.bg.glass};
  flex-shrink: 0;

  @media (min-width: ${theme.breakpoints.sm}) {
    padding: ${theme.spacing.lg};
  }

  @media (max-width: ${theme.breakpoints.sm}) {
    padding: ${theme.spacing.md};
  }
`;

const SearchInput = styled.input`
  width: 100%;
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  background: ${theme.colors.bg.card};
  border: 1px solid ${theme.colors.border.default};
  border-radius: 0;
  font-size: ${theme.typography.sizes.md};
  color: ${theme.colors.text.primary};
  transition: all ${theme.transition.base};

  &:focus {
    outline: 2px solid ${theme.colors.accent.primary};
    outline-offset: 2px;
    border-color: ${theme.colors.border.accent};
    background: ${theme.colors.bg.cardHover};
  }

  &::placeholder {
    color: ${theme.colors.text.secondary};
  }

  @media (max-width: ${theme.breakpoints.sm}) {
    font-size: ${theme.typography.sizes.base};
    padding: ${theme.spacing.md};
  }
`;

const CategoryTabs = styled.div`
  display: flex;
  gap: ${theme.spacing.sm};
  padding: ${theme.spacing.md} ${theme.spacing.lg};
  border-bottom: 1px solid ${theme.colors.border.default};
  overflow-x: auto;
  overflow-y: hidden;
  scrollbar-width: none;
  -webkit-overflow-scrolling: touch;
  background: ${theme.colors.bg.glass};
  flex-shrink: 0;

  &::-webkit-scrollbar {
    display: none;
  }

  @media (min-width: ${theme.breakpoints.sm}) {
    padding: ${theme.spacing.lg};
    gap: ${theme.spacing.md};
  }

  @media (max-width: ${theme.breakpoints.sm}) {
    padding: ${theme.spacing.sm} ${theme.spacing.md};
    gap: ${theme.spacing.xs};
  }
`;

const CategoryTab = styled.button`
  padding: ${theme.spacing.sm} ${theme.spacing.lg};
  background: ${(props) =>
    props.$active ? theme.colors.accent.primary : theme.colors.bg.card};
  color: ${(props) =>
    props.$active ? theme.colors.text.inverse : theme.colors.text.secondary};
  border: 1px solid
    ${(props) =>
      props.$active ? theme.colors.accent.primary : theme.colors.border.default};
  border-radius: 0;
  font-size: ${theme.typography.sizes.sm};
  font-weight: ${theme.typography.weights.medium};
  cursor: pointer;
  white-space: nowrap;
  transition: all ${theme.transition.base};
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;

  @media (min-width: ${theme.breakpoints.sm}) {
    &:hover {
      background: ${(props) =>
        props.$active ? theme.colors.accent.primary : theme.colors.bg.cardHover};
      border-color: ${theme.colors.border.accent};
      transform: translateY(-1px);
    }
  }

  &:active {
    transform: scale(0.95);
  }

  @media (max-width: ${theme.breakpoints.sm}) {
    padding: ${theme.spacing.xs} ${theme.spacing.sm};
    font-size: ${theme.typography.sizes.xs};
  }
`;

const IconsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(90px, 1fr));
  gap: ${theme.spacing.md};
  padding: ${theme.spacing.lg};
  max-height: 400px;
  overflow-y: auto;
  overflow-x: hidden;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE и Edge */
  -webkit-overflow-scrolling: touch;

  &::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera */
    width: 0;
    height: 0;
    background: transparent;
  }

  @media (min-width: ${theme.breakpoints.sm}) {
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
    gap: ${theme.spacing.md};
    padding: ${theme.spacing.lg};
  }

  @media (max-width: ${theme.breakpoints.sm}) {
    grid-template-columns: repeat(auto-fill, minmax(75px, 1fr));
    gap: ${theme.spacing.sm};
    padding: ${theme.spacing.md};
    max-height: calc(85vh - 220px);
  }
`;

const IconButton = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${theme.spacing.xs};
  padding: ${theme.spacing.md};
  background: ${(props) =>
    props.$selected ? theme.colors.accent.primary : theme.colors.bg.card};
  border: 2px solid
    ${(props) =>
      props.$selected ? theme.colors.accent.primary : theme.colors.border.default};
  border-radius: 0;
  cursor: pointer;
  transition: all ${theme.transition.base};
  min-height: 90px;
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
  position: relative;
  overflow: hidden;

  svg {
    width: 32px;
    height: 32px;
    color: ${(props) =>
      props.$selected ? theme.colors.accent.primary : theme.colors.text.primary};
    transition: all ${theme.transition.base};
    flex-shrink: 0;
  }

  @media (min-width: ${theme.breakpoints.sm}) {
    min-height: 100px;

    &:hover {
      background: ${theme.colors.accent.primary};
      border-color: ${theme.colors.accent.primary};
      transform: translateY(-2px);
      box-shadow: none, 0 0 0 1px rgba(99, 102, 241, 0.2);

      svg {
        color: ${theme.colors.accent.primary};
        transform: scale(1.1);
      }
    }

    &:active {
      transform: translateY(0);
    }
  }

  @media (max-width: ${theme.breakpoints.sm}) {
    min-height: 75px;
    padding: ${theme.spacing.sm} ${theme.spacing.xs};
    gap: ${theme.spacing.xs};

    svg {
      width: 28px;
      height: 28px;
    }

    &:active {
      transform: scale(0.95);
      background: ${(props) =>
        props.$selected ? theme.colors.accent.primary : theme.colors.bg.cardHover};
    }
  }
`;

const IconLabel = styled.span`
  font-size: ${theme.typography.sizes.xs};
  color: ${theme.colors.text.secondary};
  text-align: center;
  line-height: 1.3;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-weight: ${theme.typography.weights.medium};
  word-break: break-word;

  @media (min-width: ${theme.breakpoints.sm}) {
    font-size: ${theme.typography.sizes.sm};
    color: ${theme.colors.text.primary};
  }

  @media (max-width: ${theme.breakpoints.sm}) {
    font-size: ${theme.typography.sizes.xs};
    line-height: 1.2;
  }
`;
